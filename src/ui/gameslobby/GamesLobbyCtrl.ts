import redraw from '../../utils/redraw'
import socket, { SEEKING_SOCKET_NAME } from '../../socket'
import { GamesLobbyHook } from '../../lichess/interfaces'

export default class GamesLobbyCtrl {
  public readonly iconChars: { [key: string]: string } = {
    'UltraBullet': '{',
    'Bullet': 'T',
    'Blitz': ')',
    'Rapid': '#',
    'Classical': '+',
    'Correspondence': ';',
    'Standard': '8',
    'Chess960': "'",
    'King of the Hill': '(',
    'Antichess': '@',
    'Atomic': '>',
    'Three-check': '.',
    'Horde': '_',
    'Racing Kings': '\ue00a',
    'Crazyhouse': '\ue00b',
    'Training': '-'
  }

  currentTab: number
  refreshTimer: number
  standardHooks: GamesLobbyHook[]
  variantHooks: GamesLobbyHook[]
  incommingHooks: GamesLobbyHook[]

  constructor() {
    console.log("Constructor");
    this.refreshTimer = -1;
    this.currentTab = 0;
    this.standardHooks = [];
    this.variantHooks = [];
    this.incommingHooks = [];

    socket.createLobby(SEEKING_SOCKET_NAME, this.init, {
      hooks: this.setHooksList,
      hli: this.syncHooks.bind(this, false),
      had: this.addHook,
      hrm: this.syncHooks.bind(this, true),
    })
    redraw();
  }

  public init = () => {
    socket.send('hookIn');
    console.log("init", this);
    this.refreshTimer = setInterval(this.resynchonize, 10000);
  }

  public cleanup = () => {
    socket.send('hookOut');
    console.log("cleanup", this);
    clearInterval(this.refreshTimer);
    this.refreshTimer = -1;
  }

  private setHooksList = (hooksList: GamesLobbyHook[]) => {
    //console.log("setHooksList", this);
    this.incommingHooks = hooksList;
    this.resynchonize();
  }

  private syncHooks = (remove: boolean, hooksIds: string) => {
    //console.log("syncHooks", this);
    let hooksIdsList = hooksIds.match(/.{8}/g) || [];
    for (let hooks of [this.standardHooks, this.variantHooks]) {
      for (let hook of hooks) {
        let inList = hooksIdsList.indexOf(hook.id) !== -1;
        hook.removed = !!hook.removed || (remove === inList);
      }
    }
    for (let i = 0; i < this.incommingHooks.length;) {
      let hook = this.incommingHooks[i];
      let inList = hooksIdsList.indexOf(hook.id) !== -1;
      if (remove === inList) {
        this.incommingHooks.splice(i, 1);
      } else {
        ++i;
      }
    }
    redraw();
  }

  private addHook = (hook: GamesLobbyHook) => {
    //console.log("addHook", this);
    this.incommingHooks.push(hook);
  }

  private resynchonize = () => {
    console.log("resynchonize", this);
    this.standardHooks = this.standardHooks.filter(hook => !hook.removed);
    this.variantHooks = this.variantHooks.filter(hook => !hook.removed);
    for (let hook of this.incommingHooks) {
      if (!!hook.variant) {
        this.variantHooks.push(hook);
      } else {
        this.standardHooks.push(hook);
      }
    }
    this.incommingHooks = [];
    redraw();
  }

  public onTabChange = (i: number) => {
    const loc = window.location.search.replace(/\?tab\=\w+$/, '')
    try {
      window.history.replaceState(window.history.state, '', loc + '?tab=' + i)
    } catch (e) { console.error(e) }
    this.currentTab = i
    redraw()
  }
}
