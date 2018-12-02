export enum ItemType {
    ARMS = "ARMS",
    ATTACHMENT = "ATTACHMENT",
    COMMODITY = "COMMODITY",
    COOLER = "COOLER",
    GADGET = "GADGET",
    GUN = "GUN",
    HELMET = "HELMET",
    LEGS = "LEGS",
    MISSILE = "MISSILE",
    ORDNANCE = "ORDNANCE",
    POWER_PLANT = "POWER_PLANT",
    QUANTUM_DRIVE = "QUANTUM_DRIVE",
    SHIELD_GENERATOR = "SHIELD_GENERATOR",
    SHIP = "SHIP",
    TORSO = "TORSO",
    TURRET = "TURRET",
    UNDERSUIT = "UNDERSUIT",
    WEAPON = "WEAPON"
}

export enum Role {
    USER = "USER",
    ADVANCED = "ADVANCED",
    USERADMIN = "USERADMIN",
    ADMIN = "ADMIN"
}

export interface CreateAccountInput {
    username: string;
    handle: string;
    email: string;
}

export interface CreateCommodityCategoryInput {
    name: string;
}

export interface CreateCommodityInput {
    name: string;
    inGameSinceVersionId: string;
    inGameSince?: string;
    commodityCategoryId: string;
}

export interface CreateGameVersionInput {
    identifier: string;
}

export interface CreateItemInput {
    name: string;
    inGameSinceVersionId: string;
    inGameSince?: string;
}

export interface Item {
    id: string;
    name: string;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
    type: ItemType;
}

export interface Account {
    id: string;
    username: string;
    handle: string;
    email?: string;
    roles?: Role[];
}

export interface Commodity extends Item {
    id: string;
    name: string;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
    type: ItemType;
}

export interface CommodityCategory {
    id: string;
    name: string;
}

export interface GameVersion {
    id: string;
    identifier: string;
}

export interface IMutation {
    signUp(createAccountInput: CreateAccountInput): Account | Promise<Account>;
    createCommodityCategory(createCommodityCategoryInput: CreateCommodityCategoryInput): CommodityCategory | Promise<CommodityCategory>;
    createGameVersion(createGameVersionInput: CreateGameVersionInput): GameVersion | Promise<GameVersion>;
    createCommodity(createCommodityInput: CreateCommodityInput): Commodity | Promise<Commodity>;
    createItem(createItemInput: CreateItemInput): Item | Promise<Item>;
}

export interface IQuery {
    accounts(): Account[] | Promise<Account[]>;
    account(id: string): Account | Promise<Account>;
    commodityCategories(): CommodityCategory[] | Promise<CommodityCategory[]>;
    commodityCategory(id: string): CommodityCategory | Promise<CommodityCategory>;
    gameVersions(): GameVersion[] | Promise<GameVersion[]>;
    gameVersion(id: string): GameVersion | Promise<GameVersion>;
    commodities(): Commodity[] | Promise<Commodity[]>;
    commodity(id: string): Commodity | Promise<Commodity>;
    items(): Item[] | Promise<Item[]>;
    item(id: string): Item | Promise<Item>;
    temp__(): boolean | Promise<boolean>;
}

export interface ISubscription {
    accountSignedUp(): Account | Promise<Account>;
    commodityCategoryCreated(): CommodityCategory | Promise<CommodityCategory>;
    gameVersionCreated(): GameVersion | Promise<GameVersion>;
    commodityCreated(): Commodity | Promise<Commodity>;
    itemCreated(): Item | Promise<Item>;
}

export type Date = any;
