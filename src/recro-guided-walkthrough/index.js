import '@servicenow/now-card'
import '@servicenow/now-button'
import '@servicenow/now-rich-text'

import { createCustomElement } from '@servicenow/ui-core'
import snabbdom from '@servicenow/ui-renderer-snabbdom'

import styles from './styles.scss'

const view = (state, { updateState }) => {
  const { properties } = state
  const data = properties.data
  if (state.visible) {
    return (
      <div class='main'>
        <now-card size={properties.size} interaction='click'>
          <now-card-header tagline={{ label: 'Guided Walkthrough' }} />
          <h3>{data[state.selectedStep].title.value}</h3>
          <now-rich-text html={data[state.selectedStep].rich_description.value} />
          <now-card-divider />
          <now-card-actions items={[
            { label: 'Back', variant: 'secondary-negative' },
            { label: 'Next', variant: 'secondary-positive' },
            { label: 'Hide' }
          ]}
          />
        </now-card>
      </div>
    )
  } else {
    return (
      <div class='main'>
        <now-button-bare
          label='Show Guided Walkthrough' variant='primary'
          size='md' iconStart='icon-arrow-up' iconEnd='' configAria={{}}
          on-click={e => updateState({ visible: true })}
        />
      </div>
    )
  }
}

createCustomElement('recro-guided-walkthrough', {
  actionHandlers: {
    'NOW_CARD_ACTIONS#ACTION_CLICKED': ({ action, updateState, state }) => {
      const buttonAction = action.payload.action.label.toUpperCase()
      console.debug(buttonAction)
      if (buttonAction === 'BACK') updateState({ selectedStep: state.selectedStep - 1 })
      if (buttonAction === 'NEXT') updateState({ selectedStep: state.selectedStep + 1 })
      if (buttonAction === 'HIDE') updateState({ visible: false })
    }
  },
  initialState: {
    visible: true,
    selectedStep: 0
  },
  properties: {
    data: { default: [] },
    size: { default: 'md' }
  },
  renderer: { type: snabbdom },
  view,
  styles
})
