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

export interface Manufacturer {
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
    createShip(createShipInput: CreateShipInput): Ship | Promise<Ship>;
    createLocationType(createLocationTypeInput: CreateLocationTypeInput): LocationType | Promise<LocationType>;
    createLocation(createLocationInput: CreateLocationInput): Location | Promise<Location>;
    createManufacturer(createManufacturerInput: CreateManufacturerInput): Manufacturer | Promise<Manufacturer>;
    joinOrganization(joinOrganizationInput: JoinOrganizationInput): OrganizationMember | Promise<OrganizationMember>;
    createOrganization(createOrganizationInput: CreateOrganizationInput): Organization | Promise<Organization>;
    createPossession(createPossessionInput: CreatePossessionInput): Possession | Promise<Possession>;
    createTransactionDetail(createTransactionDetailInput: CreateTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createBoughtTransactionDetail(createBoughtTransactionDetailInput: CreateBoughtTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createSoldTransactionDetail(createSoldTransactionDetailInput: CreateSoldTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createLostTransactionDetail(createBoughtTransactionDetailInput: CreateLostTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createLostBasedOnTransactionDetail(createLostBasedOnTransactionDetailInput: CreateLostBasedOnTransactionDetailInput): TransactionDetail | Promise<TransactionDetail>;
    createTransaction(createTransactionInput: CreateTransactionInput): Transaction | Promise<Transaction>;
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
    gameVersionCreated(): GameVersion | Promise<GameVersion>;
    itemPriceCreated(): ItemPrice | Promise<ItemPrice>;
    commodityCreated(): Commodity | Promise<Commodity>;
    itemCreated(): Item | Promise<Item>;
    shipCreated(): Ship | Promise<Ship>;
    locationTypeCreated(): LocationType | Promise<LocationType>;
    locationCreated(): Location | Promise<Location>;
    manufacturerCreated(): Manufacturer | Promise<Manufacturer>;
    organizationMemberCreated(): OrganizationMember | Promise<OrganizationMember>;
    organizationCreated(): Organization | Promise<Organization>;
    possessionCreated(): Possession | Promise<Possession>;
    transactionDetailCreated(): TransactionDetail | Promise<TransactionDetail>;
    transactionCreated(): Transaction | Promise<Transaction>;
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
