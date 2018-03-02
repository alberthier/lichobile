import i18n from '../../i18n'
import * as helper from '../helper'
import layout from '../layout'
import { header as headerWidget } from '../shared/common'
import { renderBody, renderFooter } from './gamesLobbyView'
import GamesLobbyCtrl from './GamesLobbyCtrl'

interface Attrs {
}

interface State {
  ctrl: GamesLobbyCtrl
}

export default {
  oninit() {
    this.ctrl = new GamesLobbyCtrl()
  },

  oncreate: helper.viewFadeIn,

  onremove() {
    this.ctrl.cleanup();
  },

  view() {
    const header = () => headerWidget(i18n('lobby'))
    const body = () => renderBody(this.ctrl)
    return layout.free(header, body, renderFooter)
  }
} as Mithril.Component<Attrs, State>
