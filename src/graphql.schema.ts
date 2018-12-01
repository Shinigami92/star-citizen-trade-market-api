export interface CreateCommodityCategoryInput {
    name: string;
}

export interface CommodityCategory {
    id: string;
    name: string;
}

export interface IMutation {
    createCommodityCategory(createCommodityCategoryInput: CreateCommodityCategoryInput): CommodityCategory | Promise<CommodityCategory>;
}

export interface IQuery {
    commodityCategories(): CommodityCategory[] | Promise<CommodityCategory[]>;
    commodityCategory(id: string): CommodityCategory | Promise<CommodityCategory>;
    temp__(): boolean | Promise<boolean>;
}

export interface ISubscription {
    commodityCategoryCreated(): CommodityCategory | Promise<CommodityCategory>;
}
