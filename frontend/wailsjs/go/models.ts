export namespace components {
	
	export class PriceCalculationResult {
	    quantity: number;
	    orderPrice: number;
	    OldPrice: number;
	    unitPrice: number;
	    unitPriceDiff: number;
	    currency: string;
	    minimumQuantities: string[];
	
	    static createFrom(source: any = {}) {
	        return new PriceCalculationResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quantity = source["quantity"];
	        this.orderPrice = source["orderPrice"];
	        this.OldPrice = source["OldPrice"];
	        this.unitPrice = source["unitPrice"];
	        this.unitPriceDiff = source["unitPriceDiff"];
	        this.currency = source["currency"];
	        this.minimumQuantities = source["minimumQuantities"];
	    }
	}

}

export namespace core {
	
	export class AnalysisStatus {
	    InProgress: boolean;
	    Completed: boolean;
	    Progress: number;
	    Total: number;
	    Current: number;
	    KeyIsValid: boolean;
	    IdxStart: number;
	    IdxEnd: number;
	    MouserErr: string;
	    DigikeyErr: string;
	
	    static createFrom(source: any = {}) {
	        return new AnalysisStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.InProgress = source["InProgress"];
	        this.Completed = source["Completed"];
	        this.Progress = source["Progress"];
	        this.Total = source["Total"];
	        this.Current = source["Current"];
	        this.KeyIsValid = source["KeyIsValid"];
	        this.IdxStart = source["IdxStart"];
	        this.IdxEnd = source["IdxEnd"];
	        this.MouserErr = source["MouserErr"];
	        this.DigikeyErr = source["DigikeyErr"];
	    }
	}
	export class Parameter {
	    ID: number;
	    ComponentID: number;
	    parameter: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new Parameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.parameter = source["parameter"];
	        this.value = source["value"];
	    }
	}
	export class MSDetail {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSCategory {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSCategory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSManufacturer {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSManufacturer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSDescription {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSDescription(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSPricing {
	    ID: number;
	    ComponentID: number;
	    best_supplier: string;
	    best_price: string;
	    best_unit_price: string;
	    is_moq_not_reached: boolean;
	    moq: string;
	
	    static createFrom(source: any = {}) {
	        return new MSPricing(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.best_supplier = source["best_supplier"];
	        this.best_price = source["best_price"];
	        this.best_unit_price = source["best_unit_price"];
	        this.is_moq_not_reached = source["is_moq_not_reached"];
	        this.moq = source["moq"];
	    }
	}
	export class PriceBreak {
	    ID: number;
	    MSPriceBreaksID: number;
	    Quantity: number;
	    Price: string;
	    Currency: string;
	
	    static createFrom(source: any = {}) {
	        return new PriceBreak(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.MSPriceBreaksID = source["MSPriceBreaksID"];
	        this.Quantity = source["Quantity"];
	        this.Price = source["Price"];
	        this.Currency = source["Currency"];
	    }
	}
	export class MSPriceBreaks {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: PriceBreak[];
	
	    static createFrom(source: any = {}) {
	        return new MSPriceBreaks(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = this.convertValues(source["value"], PriceBreak);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MSReplacement {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSReplacement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSCompliance {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSCompliance(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSLifeCycle {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSLifeCycle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSDataSheet {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSDataSheet(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSAvailability {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSAvailability(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class MSImg {
	    ID: number;
	    ComponentID: number;
	    supplier: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new MSImg(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.supplier = source["supplier"];
	        this.value = source["value"];
	    }
	}
	export class Label {
	    name: string;
	    color: string;
	
	    static createFrom(source: any = {}) {
	        return new Label(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.color = source["color"];
	    }
	}
	export class Designator {
	    ID: number;
	    ComponentID: number;
	    designator: string;
	    label: Label;
	
	    static createFrom(source: any = {}) {
	        return new Designator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ComponentID = source["ComponentID"];
	        this.designator = source["designator"];
	        this.label = this.convertValues(source["label"], Label);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Component {
	    id: number;
	    FileInfoID: number;
	    quantity: number;
	    mpn: string;
	    designator: string;
	    designators: Designator[];
	    image_path: MSImg[];
	    availability: MSAvailability[];
	    datasheet_url: MSDataSheet[];
	    lifecycle_status: MSLifeCycle[];
	    rohs_status: MSCompliance[];
	    suggested_replacement: MSReplacement[];
	    price_breaks: MSPriceBreaks[];
	    calculated_price: MSPricing;
	    info_messages: string[];
	    analyzed: boolean;
	    sources: string[];
	    mismatch_mpn: boolean;
	    user_description: string;
	    supplier_description: MSDescription[];
	    user_manufacturer: string;
	    supplier_manufacturer: MSManufacturer[];
	    category: MSCategory[];
	    product_detail_url: MSDetail[];
	    // Go type: time
	    last_refresh: any;
	    detailed_parameters: Parameter[];
	    Operator: string;
	    OldQuantity: number;
	    NewQuantity: number;
	
	    static createFrom(source: any = {}) {
	        return new Component(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.FileInfoID = source["FileInfoID"];
	        this.quantity = source["quantity"];
	        this.mpn = source["mpn"];
	        this.designator = source["designator"];
	        this.designators = this.convertValues(source["designators"], Designator);
	        this.image_path = this.convertValues(source["image_path"], MSImg);
	        this.availability = this.convertValues(source["availability"], MSAvailability);
	        this.datasheet_url = this.convertValues(source["datasheet_url"], MSDataSheet);
	        this.lifecycle_status = this.convertValues(source["lifecycle_status"], MSLifeCycle);
	        this.rohs_status = this.convertValues(source["rohs_status"], MSCompliance);
	        this.suggested_replacement = this.convertValues(source["suggested_replacement"], MSReplacement);
	        this.price_breaks = this.convertValues(source["price_breaks"], MSPriceBreaks);
	        this.calculated_price = this.convertValues(source["calculated_price"], MSPricing);
	        this.info_messages = source["info_messages"];
	        this.analyzed = source["analyzed"];
	        this.sources = source["sources"];
	        this.mismatch_mpn = source["mismatch_mpn"];
	        this.user_description = source["user_description"];
	        this.supplier_description = this.convertValues(source["supplier_description"], MSDescription);
	        this.user_manufacturer = source["user_manufacturer"];
	        this.supplier_manufacturer = this.convertValues(source["supplier_manufacturer"], MSManufacturer);
	        this.category = this.convertValues(source["category"], MSCategory);
	        this.product_detail_url = this.convertValues(source["product_detail_url"], MSDetail);
	        this.last_refresh = this.convertValues(source["last_refresh"], null);
	        this.detailed_parameters = this.convertValues(source["detailed_parameters"], Parameter);
	        this.Operator = source["Operator"];
	        this.OldQuantity = source["OldQuantity"];
	        this.NewQuantity = source["NewQuantity"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Filter {
	    ID: number;
	    FileInfoID: number;
	    header: number;
	    quantity: number;
	    mpn: number;
	    description: number;
	    designator: number;
	    manufacturer: number;
	
	    static createFrom(source: any = {}) {
	        return new Filter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.FileInfoID = source["FileInfoID"];
	        this.header = source["header"];
	        this.quantity = source["quantity"];
	        this.mpn = source["mpn"];
	        this.description = source["description"];
	        this.designator = source["designator"];
	        this.manufacturer = source["manufacturer"];
	    }
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	export class XlsmFile {
	    path: string;
	    content: string[][];
	    filters: Filter;
	    components: Component[];
	
	    static createFrom(source: any = {}) {
	        return new XlsmFile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.content = source["content"];
	        this.filters = this.convertValues(source["filters"], Filter);
	        this.components = this.convertValues(source["components"], Component);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace workspaces {
	
	export class APIKeys {
	    mouser_api_key: string;
	    bomulus_api_key: string;
	    dk_client_id: string;
	    dk_secret: string;
	
	    static createFrom(source: any = {}) {
	        return new APIKeys(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mouser_api_key = source["mouser_api_key"];
	        this.bomulus_api_key = source["bomulus_api_key"];
	        this.dk_client_id = source["dk_client_id"];
	        this.dk_secret = source["dk_secret"];
	    }
	}
	export class Comparison {
	    v1: string;
	    v2: string;
	
	    static createFrom(source: any = {}) {
	        return new Comparison(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.v1 = source["v1"];
	        this.v2 = source["v2"];
	    }
	}
	export class FileInfo {
	    ID: number;
	    WorkspaceID: number;
	    version_tag: number;
	    name: string;
	    path: string;
	    components: core.Component[];
	    filters: core.Filter;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.WorkspaceID = source["WorkspaceID"];
	        this.version_tag = source["version_tag"];
	        this.name = source["name"];
	        this.path = source["path"];
	        this.components = this.convertValues(source["components"], core.Component);
	        this.filters = this.convertValues(source["filters"], core.Filter);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class WorkspaceInfos {
	    name: string;
	    path: string;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    last_opened: any;
	    production_quantity: string;
	    last_comparison: Comparison;
	
	    static createFrom(source: any = {}) {
	        return new WorkspaceInfos(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.last_opened = this.convertValues(source["last_opened"], null);
	        this.production_quantity = source["production_quantity"];
	        this.last_comparison = this.convertValues(source["last_comparison"], Comparison);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Workspace {
	    ID: number;
	    workspace_infos: WorkspaceInfos;
	    files: FileInfo[];
	
	    static createFrom(source: any = {}) {
	        return new Workspace(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.workspace_infos = this.convertValues(source["workspace_infos"], WorkspaceInfos);
	        this.files = this.convertValues(source["files"], FileInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

