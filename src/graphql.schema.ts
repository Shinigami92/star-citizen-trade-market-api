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

export interface CreateGameVersionInput {
    identifier: string;
}

export interface Account {
    id: string;
    username: string;
    handle: string;
    email?: string;
    roles?: Role[];
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
}

export interface IQuery {
    accounts(): Account[] | Promise<Account[]>;
    account(id: string): Account | Promise<Account>;
    commodityCategories(): CommodityCategory[] | Promise<CommodityCategory[]>;
    commodityCategory(id: string): CommodityCategory | Promise<CommodityCategory>;
    gameVersions(): GameVersion[] | Promise<GameVersion[]>;
    gameVersion(id: string): GameVersion | Promise<GameVersion>;
    temp__(): boolean | Promise<boolean>;
}

export interface ISubscription {
    accountSignedUp(): Account | Promise<Account>;
    commodityCategoryCreated(): CommodityCategory | Promise<CommodityCategory>;
    gameVersionCreated(): GameVersion | Promise<GameVersion>;
}
