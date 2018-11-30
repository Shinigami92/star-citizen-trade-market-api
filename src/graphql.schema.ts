export class CommodityCategory {
    id: string;
    name: string;
}

export abstract class IQuery {
    abstract commodityCategories(): CommodityCategory[] | Promise<CommodityCategory[]>;

    abstract commodityCategory(id: string): CommodityCategory | Promise<CommodityCategory>;

    abstract temp__(): boolean | Promise<boolean>;
}
