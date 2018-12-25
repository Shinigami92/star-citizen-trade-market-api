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

export enum PurchaseCurrency {
    REAL_MONEY = "REAL_MONEY",
    A_UEC = "A_UEC",
    REC = "REC",
    UEC = "UEC"
}

export enum Role {
    USER = "USER",
    ADVANCED = "ADVANCED",
    USERADMIN = "USERADMIN",
    ADMIN = "ADMIN"
}

export enum TransactionDetailType {
    BOUGHT = "BOUGHT",
    SOLD = "SOLD",
    LOST = "LOST"
}

export interface CreateAccountInput {
    username: string;
    handle: string;
    email: string;
}

export interface CreateBoughtTransactionDetailInput {
    transactionId: string;
    locationId: string;
    price: number;
    quantity: number;
    note?: string;
    timestamp?: Date;
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

export interface CreateFirstTransactionDetailInput {
    locationId: string;
    price: number;
    quantity: number;
    note?: string;
    timestamp?: Date;
}

export interface CreateGameVersionInput {
    identifier: string;
    release?: Date;
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
    scannedInGameVersionId?: string;
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

export interface CreateLostBasedOnTransactionDetailInput {
    transactionDetailId: string;
    locationId?: string;
    note?: string;
    timestamp?: Date;
}

export interface CreateLostTransactionDetailInput {
    transactionId: string;
    locationId?: string;
    price: number;
    quantity: number;
    note?: string;
    timestamp?: Date;
}

export interface CreateManufacturerInput {
    name: string;
}

export interface CreateOrganizationInput {
    name: string;
    spectrumId: string;
}

export interface CreatePossessionInput {
    accountId?: string;
    itemId: string;
    purchasePrice: number;
    purchaseCurrency: PurchaseCurrency;
    purchaseDate?: Date;
}

export interface CreateShipInput {
    name: string;
    inGameSinceVersionId: string;
    inGameSince?: Date;
    scu: number;
    manufacturerId: string;
    focus: string;
    size: number;
}

export interface CreateSoldTransactionDetailInput {
    transactionId: string;
    locationId: string;
    price: number;
    quantity: number;
    note?: string;
    timestamp?: Date;
}

export interface CreateTransactionDetailInput {
    transactionId: string;
    type: TransactionDetailType;
    locationId?: string;
    price: number;
    quantity: number;
    note?: string;
    timestamp?: Date;
}

export interface CreateTransactionInput {
    accountId?: string;
    commodityId: string;
    transactionDetail: CreateFirstTransactionDetailInput;
}

export interface JoinOrganizationInput {
    organizationId: string;
    accountId?: string;
    since?: Date;
}

export interface TradeSearchInput {
    startLocationId?: string;
    endLocationId?: string;
    itemIds?: string[];
    gameVersionId?: string;
}

export interface UpdateCommodityCategoryInput {
    name?: string;
}

export interface UpdateCommodityInput {
    name?: string;
    inGameSinceVersionId?: string;
    inGameSince?: Date;
    commodityCategoryId?: string;
}

export interface UpdateGameVersionInput {
    identifier?: string;
    release?: Date;
}

export interface UpdateItemPriceInput {
    scannedById?: string;
    itemId?: string;
    locationId?: string;
    price?: number;
    quantity?: number;
    scanTime?: Date;
    type?: ItemPriceType;
    visibility?: ItemPriceVisibility;
    scannedInGameVersionId?: string;
}

export interface UpdateLocationInput {
    name?: string;
    parentLocationId?: string;
    typeId?: string;
    inGameSinceVersionId?: string;
    inGameSince?: Date;
}

export interface UpdateLocationTypeInput {
    name?: string;
}

export interface UpdateManufacturerInput {
    name?: string;
}

export interface UpdateOrganizationInput {
    name?: string;
    spectrumId?: string;
}

export interface UpdateShipInput {
    name?: string;
    inGameSinceVersionId?: string;
    inGameSince?: Date;
    scu?: number;
    manufacturerId?: string;
    focus?: string;
    size?: number;
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

export interface AuthToken {
    id: string;
    username: string;
    roles: Role[];
    token: string;
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

export interface FallbackItem extends Item {
    id: string;
    name: string;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
    type: ItemType;
}

export interface GameVersion {
    id: string;
    identifier: string;
    release?: Date;
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
    unitPrice: number;
    scanTime: Date;
    type: ItemPriceType;
    visibility: ItemPriceVisibility;
    scannedInGameVersionId: string;
    scannedInGameVersion: GameVersion;
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
    children: Location[];
}

export interface LocationType {
    id: string;
    name: string;
}

export interface Manufacturer {
    id: string;
    name: string;
}

export interface IMutation {
    signUp(input: CreateAccountInput): Account | Promise<Account>;
    createCommodityCategory(input: CreateCommodityCategoryInput): CommodityCategory | Promise<CommodityCategory>;
    updateCommodityCategory(id: string, input: UpdateCommodityCategoryInput): CommodityCategory | Promise<CommodityCategory>;
    createGameVersion(input: CreateGameVersionInput): GameVersion | Promise<GameVersion>;
    updateGameVersion(id: string, input: UpdateGameVersionInput): GameVersion | Promise<GameVersion>;
    createItemPrice(input: CreateItemPriceInput): ItemPrice | Promise<ItemPrice>;
    updateItemPrice(id: string, input: UpdateItemPriceInput): ItemPrice | Promise<ItemPrice>;
    createCommodity(input: CreateCommodityInput): Commodity | Promise<Commodity>;
    updateCommodity(id: string, input: UpdateCommodityInput): Commodity | Promise<Commodity>;
    createItem(input: CreateItemInput): Item | Promise<Item>;
    createShip(input: CreateShipInput): Ship | Promise<Ship>;
    updateShip(id: string, input: UpdateShipInput): Ship | Promise<Ship>;
    createLocationType(input: CreateLocationTypeInput): LocationType | Promise<LocationType>;
    updateLocationType(id: string, input: UpdateLocationTypeInput): LocationType | Promise<LocationType>;
    createLocation(input: CreateLocationInput): Location | Promise<Location>;
    updateLocation(id: string, input: UpdateLocationInput): Location | Promise<Location>;
    createManufacturer(input: CreateManufacturerInput): Manufacturer | Promise<Manufacturer>;
    updateManufacturer(id: string, input: UpdateManufacturerInput): Manufacturer | Promise<Manufacturer>;
    joinOrganization(input: JoinOrganizationInput): OrganizationMember | Promise<OrganizationMember>;
    createOrganization(input: CreateOrganizationInput): Organization | Promise<Organization>;
    updateOrganization(id: string, input: UpdateOrganizationInput): Organization | Promise<Organization>;
    createPossession(input: CreatePossessionInput): Possession | Promise<Possession>;
    createTransactionDetail(input: CreateTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createBoughtTransactionDetail(input: CreateBoughtTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createSoldTransactionDetail(input: CreateSoldTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createLostTransactionDetail(input: CreateLostTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createLostBasedOnTransactionDetail(input: CreateLostBasedOnTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createTransaction(input: CreateTransactionInput): Transaction | Promise<Transaction>;
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

export interface Possession {
    id: string;
    accountId: string;
    account: Account;
    itemId: string;
    item: Item;
    purchasePrice: number;
    purchaseCurrency: PurchaseCurrency;
    purchaseDate?: Date;
}

export interface IQuery {
    accounts(): Account[] | Promise<Account[]>;
    account(id: string): Account | Promise<Account>;
    signIn(username: string, password: string): AuthToken | Promise<AuthToken>;
    me(): Account | Promise<Account>;
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
    ships(): Ship[] | Promise<Ship[]>;
    ship(id: string): Ship | Promise<Ship>;
    locationTypes(): LocationType[] | Promise<LocationType[]>;
    locationType(id: string): LocationType | Promise<LocationType>;
    locations(): Location[] | Promise<Location[]>;
    location(id: string): Location | Promise<Location>;
    manufacturers(): Manufacturer[] | Promise<Manufacturer[]>;
    manufacturer(id: string): Manufacturer | Promise<Manufacturer>;
    organizationMembers(): OrganizationMember[] | Promise<OrganizationMember[]>;
    organizationMember(organizationId: string, accountId: string): OrganizationMember | Promise<OrganizationMember>;
    organizations(): Organization[] | Promise<Organization[]>;
    organization(id: string): Organization | Promise<Organization>;
    possessions(): Possession[] | Promise<Possession[]>;
    possession(id: string): Possession | Promise<Possession>;
    trades(searchInput?: TradeSearchInput): Trade[] | Promise<Trade[]>;
    transactionDetails(): TransactionDetail[] | Promise<TransactionDetail[]>;
    transactionDetail(id: string): TransactionDetail | Promise<TransactionDetail>;
    transactions(): Transaction[] | Promise<Transaction[]>;
    transaction(id: string): Transaction | Promise<Transaction>;
    temp__(): boolean | Promise<boolean>;
}

export interface Ship extends Item {
    id: string;
    name: string;
    inGameSinceVersionId: string;
    inGameSinceVersion: GameVersion;
    inGameSince?: Date;
    type: ItemType;
    scu: number;
    manufacturerId: string;
    manufacturer: Manufacturer;
    focus: string;
    size: number;
}

export interface ISubscription {
    accountSignedUp(): Account | Promise<Account>;
    commodityCategoryCreated(): CommodityCategory | Promise<CommodityCategory>;
    commodityCategoryUpdated(): CommodityCategory | Promise<CommodityCategory>;
    gameVersionCreated(): GameVersion | Promise<GameVersion>;
    gameVersionUpdated(): GameVersion | Promise<GameVersion>;
    itemPriceCreated(): ItemPrice | Promise<ItemPrice>;
    itemPriceUpdated(): ItemPrice | Promise<ItemPrice>;
    commodityCreated(): Commodity | Promise<Commodity>;
    commodityUpdated(): Commodity | Promise<Commodity>;
    itemCreated(): Item | Promise<Item>;
    shipCreated(): Ship | Promise<Ship>;
    shipUpdated(): Ship | Promise<Ship>;
    locationTypeCreated(): LocationType | Promise<LocationType>;
    locationTypeUpdated(): LocationType | Promise<LocationType>;
    locationCreated(): Location | Promise<Location>;
    locationUpdated(): Location | Promise<Location>;
    manufacturerCreated(): Manufacturer | Promise<Manufacturer>;
    manufacturerUpdated(): Manufacturer | Promise<Manufacturer>;
    organizationMemberCreated(): OrganizationMember | Promise<OrganizationMember>;
    organizationCreated(): Organization | Promise<Organization>;
    organizationUpdated(): Organization | Promise<Organization>;
    possessionCreated(): Possession | Promise<Possession>;
    transactionDetailCreated(): TransactionDetail | Promise<TransactionDetail>;
    transactionCreated(): Transaction | Promise<Transaction>;
}

export interface Trade {
    buyItemPrice: ItemPrice;
    sellItemPrice: ItemPrice;
    item: Item;
    startLocation: Location;
    endLocation: Location;
    profit: number;
    margin: number;
    scanTime: Date;
    scannedInGameVersionId: string;
    scannedInGameVersion: GameVersion;
}

export interface Transaction {
    id: string;
    accountId: string;
    account: Account;
    commodityId: string;
    commodity: Commodity;
}

export interface TransactionDetail {
    id: string;
    transactionId: string;
    transaction: Transaction;
    type: TransactionDetailType;
    locationId: string;
    location: Location;
    price: number;
    quantity: number;
    note?: string;
    timestamp: Date;
}

export type Date = any;
