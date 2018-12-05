export enum ItemPriceType {
    BUY = "BUY",
    SELL = "SELL"
}

export enum ItemPriceVisibility {
    PRIVATE = "PRIVATE",
    MAIN_ORGANIZATION = "MAIN_ORGANIZATION",
    MEMBER_ORGANIZATION = "MEMBER_ORGANIZATION",
    PUBLIC = "PUBLIC"
}

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
    inGameSince?: Date;
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

export interface CreateItemPriceInput {
    scannedById?: string;
    itemId: string;
    locationId: string;
    price: number;
    quantity: number;
    scanTime?: Date;
    type: ItemPriceType;
    visibility?: ItemPriceVisibility;
}

export interface CreateLocationInput {
    name: string;
    parentLocationId?: string;
    typeId: string;
    inGameSinceVersionId: string;
    inGameSince?: Date;
}

export interface CreateLocationTypeInput {
    name: string;
}

export interface CreateOrganizationInput {
    name: string;
    spectrumId: string;
}

export interface JoinOrganizationInput {
    organizationId: string;
    accountId?: string;
    since?: Date;
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
    roles: Role[];
    mainOrganizationId?: string;
    mainOrganization?: Organization;
}

export interface Commodity extends Item {
    id: string;
    name: string;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
    type: ItemType;
    commodityCategoryId: string;
    commodityCategory: CommodityCategory;
}

export interface CommodityCategory {
    id: string;
    name: string;
}

export interface GameVersion {
    id: string;
    identifier: string;
}

export interface ItemPrice {
    id: string;
    scannedById: string;
    scannedBy: Account;
    itemId: string;
    item: Item;
    locationId: string;
    location: Location;
    price: number;
    quantity: number;
    scanTime: Date;
    type: ItemPriceType;
    visibility: ItemPriceVisibility;
}

export interface Location {
    id: string;
    name: string;
    parentLocationId?: string;
    parentLocation?: Location;
    typeId: string;
    type: LocationType;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
}

export interface LocationType {
    id: string;
    name: string;
}

export interface IMutation {
    signUp(createAccountInput: CreateAccountInput): Account | Promise<Account>;
    createCommodityCategory(createCommodityCategoryInput: CreateCommodityCategoryInput): CommodityCategory | Promise<CommodityCategory>;
    createGameVersion(createGameVersionInput: CreateGameVersionInput): GameVersion | Promise<GameVersion>;
    createItemPrice(createItemPriceInput: CreateItemPriceInput): ItemPrice | Promise<ItemPrice>;
    createCommodity(createCommodityInput: CreateCommodityInput): Commodity | Promise<Commodity>;
    createItem(createItemInput: CreateItemInput): Item | Promise<Item>;
    createLocationType(createLocationTypeInput: CreateLocationTypeInput): LocationType | Promise<LocationType>;
    createLocation(createLocationInput: CreateLocationInput): Location | Promise<Location>;
    joinOrganization(joinOrganizationInput: JoinOrganizationInput): OrganizationMember | Promise<OrganizationMember>;
    createOrganization(createOrganizationInput: CreateOrganizationInput): Organization | Promise<Organization>;
}

export interface Organization {
    id: string;
    name: string;
    spectrumId: string;
}

export interface OrganizationMember {
    organizationId: string;
    organization: Organization;
    accountId: string;
    account: Account;
    since?: Date;
}

export interface IQuery {
    accounts(): Account[] | Promise<Account[]>;
    account(id: string): Account | Promise<Account>;
    commodityCategories(): CommodityCategory[] | Promise<CommodityCategory[]>;
    commodityCategory(id: string): CommodityCategory | Promise<CommodityCategory>;
    gameVersions(): GameVersion[] | Promise<GameVersion[]>;
    gameVersion(id: string): GameVersion | Promise<GameVersion>;
    itemPrices(): ItemPrice[] | Promise<ItemPrice[]>;
    itemPrice(id: string): ItemPrice | Promise<ItemPrice>;
    commodities(): Commodity[] | Promise<Commodity[]>;
    commodity(id: string): Commodity | Promise<Commodity>;
    items(): Item[] | Promise<Item[]>;
    item(id: string): Item | Promise<Item>;
    locationTypes(): LocationType[] | Promise<LocationType[]>;
    locationType(id: string): LocationType | Promise<LocationType>;
    locations(): Location[] | Promise<Location[]>;
    location(id: string): Location | Promise<Location>;
    organizationMembers(): OrganizationMember[] | Promise<OrganizationMember[]>;
    organizationMember(organizationId: string, accountId: string): OrganizationMember | Promise<OrganizationMember>;
    organizations(): Organization[] | Promise<Organization[]>;
    organization(id: string): Organization | Promise<Organization>;
    temp__(): boolean | Promise<boolean>;
}

export interface ISubscription {
    accountSignedUp(): Account | Promise<Account>;
    commodityCategoryCreated(): CommodityCategory | Promise<CommodityCategory>;
    gameVersionCreated(): GameVersion | Promise<GameVersion>;
    itemPriceCreated(): ItemPrice | Promise<ItemPrice>;
    commodityCreated(): Commodity | Promise<Commodity>;
    itemCreated(): Item | Promise<Item>;
    locationTypeCreated(): LocationType | Promise<LocationType>;
    locationCreated(): Location | Promise<Location>;
    organizationMemberCreated(): OrganizationMember | Promise<OrganizationMember>;
    organizationCreated(): Organization | Promise<Organization>;
}

export type Date = any;
