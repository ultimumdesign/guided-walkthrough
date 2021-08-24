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
          <now-card-actions
            items={[
              { label: 'Back' },
              { label: 'Next' },
              { label: 'Hide' }
            ]}
          />
          <now-card-divider />
          <now-card-footer label={{ start: '', end: (state.selectedStep + 1) + 'of ' + data.length }} split='equal' />
        </now-card>
      </div>
    )
  } else {
    return (
      <div class='main'>
        <now-button-bare
          label='Show Guided Walkthrough' variant='primary'
          size='md' iconStart='icon-arrow-up' iconEnd='' configAria={{}}
          on-click={() => updateState({ visible: true })}
        />
      </div>
    )
  }
}

createCustomElement('recro-guided-walkthrough', {
  actionHandlers: {
    'NOW_CARD_ACTIONS#ACTION_CLICKED': ({ action, updateState, state, properties }) => {
      const data = properties.data
      const buttonAction = action.payload.action.label.toUpperCase()
      console.debug(buttonAction)
      if (buttonAction === 'BACK' && state.selectedStep > 0) updateState({ selectedStep: state.selectedStep - 1 })
      if (buttonAction === 'NEXT' && (state.selectedStep + 1 < data.length)) updateState({ selectedStep: state.selectedStep + 1 })
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
