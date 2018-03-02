import { GameData } from './game'
import { AnalyseData } from './analyse'

export interface Pool {
  readonly id: string
  readonly lim: number
  readonly inc: number
  readonly perf: string
}

export interface PoolMember {
  readonly id: string
}

export interface LobbyData {
  readonly lobby: {
    readonly version: number
    readonly pools: ReadonlyArray<Pool>
  }
}

export interface HookData {
  readonly hook: {
    readonly id: string
  }
}

export interface LightPlayer {
  readonly name: string
  readonly title?: string
  readonly rating?: number
}

export type ModeId = 0 | 1 // casual | rated
export type TimeModeId = 0 | 1 | 2 // unlimited | realTime | correspondence

export interface SeekSetup {
  readonly variant: number
  readonly timeMode: TimeModeId
  readonly days: number
  readonly time: number
  readonly increment: number
  readonly color: Color | 'random'
}

export interface HumanSeekSetup extends SeekSetup {
  readonly mode: ModeId
  readonly ratingMin?: number
  readonly ratingMax?: number
}

export interface AiSeekSetup extends SeekSetup {
  readonly level: number
  readonly fen?: string
}

export interface CorrespondenceSeek {
  readonly id: string
  readonly username: string
  readonly rating: number
  readonly variant: Variant
  readonly mode: ModeId
  readonly days: number
  readonly color: Color
  readonly perf: {
    readonly icon: string
    readonly name: PerfKey
  }
}

export enum SpeedId {
  UltraBullet = 0,    // Insanely fast games: less than 30 seconds
  Bullet = 1,         // Very fast games: less than 3 minutes
  Blitz = 2,          // Fast games: 3 to 8 minutes
  Rapid = 5,          // Rapid games: 8 to 25 minutes
  Classical = 3,      // Classical games: 25 minutes and more
  Correspondence = 4, // Correspondence games
}

export interface GamesLobbyHook {
  readonly id: string           // Game ID
  readonly uid: string          // User ID
  readonly clock: string
  readonly c?: Color
  readonly t: number            // Estimated game duration
  readonly s: SpeedId           // Game speed category ID
  readonly u?: string           // User name
  readonly rating?: number      // User rating
  readonly ra?: number          // Rated if present
  readonly perf: string         // Perf name
  readonly prov?: boolean       // User has provisional rating
  readonly variant?: VariantKey // Game variant if not standard chess
  removed?: boolean              // Has hook been removed
}

export interface PongMessage {
  readonly d: number
  readonly r: number
}

export interface TimelineEntry {
  readonly data: any
  readonly date: number
  readonly type: string
}

export interface TimelineData {
  readonly entries: ReadonlyArray<TimelineEntry>
}

export interface DailyPuzzle {
  readonly id: string
  readonly fen: string
  readonly color: Color
}

export interface NowPlayingOpponent {
  readonly username: string
  readonly id?: string
  readonly rating?: number
  readonly ai?: number
}

export interface NowPlayingGame {
  readonly gameId: string
  readonly fullId: string
  readonly isMyTurn: boolean
  readonly lastMove?: string
  readonly variant: Variant
  readonly speed: Speed
  readonly perf: PerfKey
  readonly color: Color
  readonly fen: string
  readonly rated: boolean
  readonly opponent: NowPlayingOpponent
  readonly secondsLeft?: number
}

export interface MiniUserPlayer {
  showing: boolean
  data: any
}
export interface MiniUser {
  readonly player: MiniUserPlayer
  readonly opponent: MiniUserPlayer
  readonly [index: string]: MiniUserPlayer
}

export interface MiniBoardGameObjPlayer {
  readonly rating: number
  readonly user: {
    readonly username: string
  }
}

export interface MiniBoardGameObj {
  readonly player: MiniBoardGameObjPlayer
  readonly opponent: MiniBoardGameObjPlayer
  readonly clock?: {
    readonly initial: number
    readonly increment: number
  }
  readonly correspondence?: {
    readonly daysPerTurn: number
  }
}

export interface Paginator<T> {
  readonly currentPage: number
  readonly maxPerPage: number
  readonly currentPageResults: Array<T>
  readonly nbResults: number
  readonly previousPage: number
  readonly nextPage: number
  readonly nbPages: number
}

interface ApiVersion {
  readonly version: number
  readonly deprecatedAt: Timestamp
  readonly unsupportedAt: Timestamp
}

export interface ApiStatus {
  readonly api: {
    readonly current: number
    readonly olds: ApiVersion[]
  }
  // version is detected as buggy
  readonly mustUpgrade?: boolean
}

export function isPoolMember(conf: PoolMember | SeekSetup): conf is PoolMember {
  return (conf as PoolMember).id !== undefined
}

export function isSeekSetup(conf: PoolMember | SeekSetup): conf is SeekSetup {
  return (conf as SeekSetup).timeMode !== undefined
}
export function isGameData(data: GameData | AnalyseData): data is GameData {
  return (data as GameData).steps !== undefined
}
