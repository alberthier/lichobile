import * as h from 'mithril/hyperscript'
import * as helper from '../helper'
import i18n from '../../i18n'
import newGameForm from '../newGameForm'
import TabNavigation from '../shared/TabNavigation'
import TabView from '../shared/TabView'

import GamesLobbyCtrl from './GamesLobbyCtrl'
import { GamesLobbyHook } from '../../lichess/interfaces';

const tabButtons = [
  {
    label: i18n('standard')
  },
  {
    label: i18n('variants')
  }
]

export function renderBody(ctrl: GamesLobbyCtrl) {
  const tabsBar = h(TabNavigation, {
    buttons: tabButtons,
    selectedIndex: ctrl.currentTab,
    onTabChange: ctrl.onTabChange
  })

  return [
    h('div.tabs-nav-header', tabsBar, h('div.main_header_drop_shadow')),
    h(TabView, {
      className: 'gameslobby-tabs',
      selectedIndex: ctrl.currentTab,
      content: [Date.now(), Date.now()],
      renderer: (tab: any, i: number) => renderTabContent(ctrl, tab, i),
      onTabChange: ctrl.onTabChange
    })
  ]
}

function renderTabContent(ctrl: GamesLobbyCtrl, _tab: any, index: number) {
  console.log("renderTab", ctrl);
  let hooks = index === 0 ? ctrl.standardHooks : ctrl.variantHooks;
  let hooksRender = [];
  for (let hook of hooks) {
    let username = hook.u ? hook.u : i18n('anonymous');
    let rating = hook.rating ? hook.rating : '';
    if (hook.prov) {
      rating += '?';
    }
    let icon = h('div.type.icon', {
      'data-icon': ctrl.iconChars[hook.perf]
    });
    let color = h('span.color.icon.small', {
      'data-icon': hook.c ? hook.c === 'white' ? 'K' : 'J' : 'l'
    });
    let rated = h('span.icon.rated' + (hook.ra ? '' : '.hidden'), { 'data-icon': 't' });
    hooksRender.push(h('li.list_item' + (hook.removed ? '.disabled' : ''),
      icon, color, h('span.username', username),
      h('span.rating.small', rating),
      h('span.hook-clock.small', hook.clock), rated));
  }
  return h('ul.gameslobby.native_scroller.page', hooksRender);
}

export function renderFooter() {
  return h('div.actions_bar', h('button.action_create_button', {
    oncreate: helper.ontap(() => newGameForm.openRealTime())
  }, [h('span.fa.fa-plus-circle'), i18n('createAGame')]));
}
