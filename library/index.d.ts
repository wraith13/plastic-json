export * as Locale from "./locale";
export declare module Jsonarch {
    export interface StructureObject<Element> {
        [key: string]: undefined | Structure<Element>;
    }
    export type Structure<Element> = Element | Structure<Element>[] | StructureObject<Element>;
    export type JsonableValue = null | boolean | number | string;
    export type JsonableObject = StructureObject<JsonableValue>;
    export type Jsonable = Structure<JsonableValue>;
    export type JsonablePartial<Target> = {
        [key in keyof Target]?: Target[key];
    } & JsonableObject;
    export const jsonStringify: <T extends Jsonable>(source: T, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number) => string;
    export const jsonParse: <T extends Jsonable = Jsonable>(text: string, reviver?: ((this: any, key: string, value: any) => any) | undefined) => T;
    export const objectKeys: <T extends {}>(target: T) => (keyof T & string)[];
    export const objectValues: <T extends {}>(target: T) => T[keyof T][];
    export const isString: (value: unknown) => value is string;
    export const isNumber: (value: unknown) => value is number;
    export const isObject: <T extends {}>(value: unknown, isMember?: { [key in keyof T]?: ((x: unknown) => x is T[key]) | undefined; }) => value is T;
    export const isArray: <T>(value: unknown, isType: (x: unknown) => x is T) => value is T[];
    export const getTemporaryDummy: "en" | "ja";
    export const packageJson: {
        name: string;
        version: string;
        preview: boolean;
        description: string;
        author: string;
        license: string;
    };
    export const name: string;
    export const version: string;
    export const templateSchema = "https://raw.githubusercontent.com/wraith13/jsonarch/master/json-schema/template-json-schema.json#";
    export const settingSchema = "https://raw.githubusercontent.com/wraith13/jsonarch/master/json-schema/setting-json-schema.json#";
    export interface AlphaJsonarch extends JsonableObject {
        $arch: string;
    }
    export const isJsonarch: <Type_1 extends AlphaJsonarch>(type: Type_1["$arch"]) => (template: any) => template is Type_1;
    export const isAlphaJsonarch: (template: any) => template is AlphaJsonarch;
    export interface Profile {
        isProfiling: boolean;
        score: {
            [scope: string]: number;
        };
        stack: ProfileEntry[];
    }
    export interface ProfileEntry {
        name: string;
        startTicks: number;
        childrenTicks: number;
    }
    export type SystemFileType = "boot-setting.json" | "default-setting.json";
    export type HashType = string;
    export interface SystemFileContext {
        category: "system";
        id: SystemFileType;
        hash?: HashType;
    }
    export interface NoneFileContext<DataType extends Jsonable = Jsonable> {
        category: "none";
        data: DataType;
        hash?: HashType;
    }
    export interface NetFileContext {
        category: "net";
        path: string;
        hash?: HashType;
    }
    export interface LocalFileContext {
        category: "local";
        path: string;
        hash?: HashType;
    }
    export type FilePathCategory<DataType extends Jsonable = Jsonable> = FileContext<DataType>["category"];
    export type FileContext<DataType extends Jsonable = Jsonable> = SystemFileContext | NoneFileContext<DataType> | NetFileContext | LocalFileContext;
    export const isSystemFileContext: (file: FileContext) => file is SystemFileContext;
    export const isNoneFileContext: <DataType extends Jsonable = Jsonable>(file: FileContext) => file is NoneFileContext<DataType>;
    export const isNetFileContext: (file: FileContext) => file is NetFileContext;
    export const isLocalFileContext: (file: FileContext) => file is LocalFileContext;
    export const makeFullPath: (contextOrEntry: ContextOrEntry, path: string) => string;
    export const getSystemFileContext: (id: SystemFileType) => SystemFileContext;
    export const jsonToFileContext: <DataType extends Jsonable = Jsonable>(data: DataType, hash?: HashType) => NoneFileContext<DataType>;
    export const pathToFileContext: (contextOrEntry: ContextOrEntry, path: string) => NetFileContext | LocalFileContext;
    export const getHashFromPath: (path: string) => HashType | undefined;
    export const commandLineArgumentToFileContext: <DataType extends Jsonable = Jsonable>(argument: string) => FileContext<DataType>;
    export interface Context {
        template: FileContext;
        parameter?: FileContext;
        cache?: FileContext<Cache>;
        setting?: FileContext<Setting>;
        profile?: Profile;
    }
    export type ContextOrEntry = Context | {
        context: Context;
    };
    export const getContext: (contextOrEntry: ContextOrEntry) => Context;
    export interface Cache extends AlphaJsonarch {
        $arch: "cache";
        json?: {
            [path: string]: Jsonable;
        };
        template?: {
            [key: string]: Jsonable;
        };
        type?: {
            [key: string]: Jsonable;
        };
        value?: {
            [key: string]: Jsonable;
        };
    }
    export const isCache: (template: any) => template is Cache;
    export interface Setting extends AlphaJsonarch {
        $arch: "setting";
        language?: string;
        indent?: "minify" | "smart" | "tab" | number;
        textOutput?: boolean;
        timeout?: number;
        trace?: "stdout" | "stderr" | boolean;
        profile?: false | "template" | "parameter" | "both";
        originMap?: false | "template" | "parameter" | "both";
        influenceMap?: false | "template" | "parameter" | "both";
        callGraph?: boolean;
    }
    export const isSetting: (template: any) => template is Setting;
    interface LoadEntry<ContextType extends FileContext = FileContext> {
        context: Context;
        cache: Cache;
        setting: Setting;
        handler: Handler;
        file: ContextType;
    }
    export const isSystemFileLoadEntry: (entry: LoadEntry) => entry is LoadEntry<SystemFileContext>;
    export const isNoneFileLoadEntry: <DataType extends Jsonable = Jsonable>(entry: LoadEntry) => entry is LoadEntry<NoneFileContext<DataType>>;
    export const isNetFileLoadEntry: (entry: LoadEntry) => entry is LoadEntry<NetFileContext>;
    export const isLocalFileLoadEntry: (entry: LoadEntry) => entry is LoadEntry<LocalFileContext>;
    export interface Handler {
        load?: (entry: LoadEntry<NetFileContext | LocalFileContext>) => Promise<string>;
    }
    interface EvaluateEntry<TemplateType> {
        context: Context;
        template: TemplateType;
        parameter: Jsonable | undefined;
        cache: Cache;
        setting: Setting;
        handler: Handler;
    }
    interface CompileEntry extends Context {
        handler: Handler;
    }
    export const isEvaluateTargetEntry: (entry: EvaluateEntry<Jsonable>) => entry is EvaluateEntry<AlphaJsonarch>;
    export interface Result extends AlphaJsonarch {
        $arch: "result";
        output: Jsonable;
        profile?: any;
        trace?: any;
        originMap?: any;
        influenceMap?: any;
        callGraph?: any;
        setting: Setting;
    }
    export const isResult: (template: any) => template is Result;
    export interface JsonarchError extends AlphaJsonarch {
        $arch: "error";
        message: string;
    }
    export const isError: (template: any) => template is JsonarchError;
    export const getTicks: () => number;
    export const profile: <ResultT>(contextOrEntry: Context | {
        context: Context;
    }, name: string, target: () => Promise<ResultT>) => Promise<ResultT>;
    export const ErrorJson: {
        (json: JsonarchError): Error;
        new (json: JsonarchError): Error;
    };
    export const parseErrorJson: (error: Error) => JsonarchError;
    export const loadSystemJson: <DataType extends Jsonable = Jsonable>(entry: LoadEntry<SystemFileContext>) => Promise<DataType>;
    export const loadNetFile: (entry: LoadEntry<NetFileContext>) => Promise<string>;
    export const loadLocalFile: (entry: LoadEntry<LocalFileContext>) => Promise<string>;
    export const loadFile: (entry: LoadEntry<NetFileContext | LocalFileContext>) => Promise<string>;
    export const load: <DataType extends Jsonable = Jsonable>(entry: LoadEntry<FileContext<DataType>>) => Promise<DataType>;
    export interface StaticTemplate extends AlphaJsonarch {
        $arch: "static";
        return: Jsonable;
    }
    export const isStaticData: (template: any) => template is StaticTemplate;
    export const evaluateStatic: (entry: EvaluateEntry<StaticTemplate>) => Promise<Jsonable>;
    export interface IncludeStaticJsonTemplate extends AlphaJsonarch {
        $arch: "include-static-json";
        path: string;
    }
    export const isIncludeStaticJsonData: (template: any) => template is IncludeStaticJsonTemplate;
    export const evaluateIncludeStaticJson: (entry: EvaluateEntry<IncludeStaticJsonTemplate>) => Promise<Jsonable>;
    export interface Template extends AlphaJsonarch {
        $arch: "template";
        type?: string;
        default?: {
            parameter?: Jsonable;
            setting?: Setting;
        };
        override?: {
            parameter?: Jsonable;
            setting?: Setting;
        };
        member?: JsonableObject;
        return: Jsonable;
        catch?: JsonableObject;
    }
    export const isTemplateData: (template: any) => template is Template;
    export const applyDefault: (defaults: Jsonable | undefined, parameter: Jsonable | undefined) => Jsonable | undefined;
    export const evaluateTemplate: (entry: EvaluateEntry<Template>) => Promise<Jsonable>;
    type ReferKeyElement = string;
    type ReferIndextElement = number;
    type ReferElement = ReferKeyElement | ReferIndextElement;
    type Refer = ReferElement[];
    export type PrimitiveValueType = "null" | "boolean" | "number" | "string";
    export type PrimitiveCompositeType = "or" | "and";
    export interface AlphaType extends AlphaJsonarch {
        $arch: "type";
        type: PrimitiveType;
        optional?: boolean;
    }
    export const isAlphaTypeData: <Type_1 extends AlphaType>(type: Type_1["type"]) => (template: any) => template is Type_1;
    export interface TypeRefer extends AlphaType {
        $arch: "type";
        type: "refer";
        refer: Refer;
        parameter?: Jsonable;
    }
    export const isTypeReferData: (template: any) => template is TypeRefer;
    export interface NullValueType extends AlphaType {
        $arch: "type";
        type: "null";
    }
    export const isNullValueTypeData: (template: any) => template is NullValueType;
    export interface BooleanValueType extends AlphaType {
        $arch: "type";
        type: "boolean";
        enum?: boolean[];
    }
    export const isBooleanValueTypeData: (template: any) => template is BooleanValueType;
    export interface FormatStringValueType extends AlphaType {
        $arch: "type";
        type: "string";
        format?: string;
    }
    export interface EnumerationStringValueType extends AlphaType {
        $arch: "type";
        type: "string";
        Enumeration?: string[];
    }
    export type StringValueType = FormatStringValueType | EnumerationStringValueType;
    export const isStringValueTypeData: (template: any) => template is StringValueType;
    export interface NumberValueType extends AlphaType {
        $arch: "type";
        type: "number";
        integerOnly?: boolean;
        minValue?: number;
        maxValue?: number;
        enum?: number[];
    }
    export const isNumberValueTypeData: (template: any) => template is NumberValueType;
    export type ValueType = NullValueType | BooleanValueType | StringValueType | NumberValueType;
    export interface ArrayType extends AlphaType {
        $arch: "type";
        type: "array";
        itemType: Type;
        minLength?: number;
        maxLength?: number;
    }
    export const isArrayTypeData: (template: any) => template is ArrayType;
    export interface TupleType extends AlphaType {
        $arch: "type";
        type: "tuple";
        list: Type[];
    }
    export const isTupleTypeData: (template: any) => template is TupleType;
    export interface ObjectType extends AlphaType {
        $arch: "type";
        type: "object";
        member: {
            [key: string]: Type;
        };
    }
    export const isObjectTypeData: (template: any) => template is ObjectType;
    export interface OrCompositeType extends AlphaType {
        $arch: "type";
        type: "or";
        list: Type[];
    }
    export const isOrCompositeTypeData: (template: any) => template is OrCompositeType;
    export interface AndCompositeType extends AlphaType {
        $arch: "type";
        type: "and";
        list: Type[];
    }
    export const isAndCompositeTypeData: (template: any) => template is AndCompositeType;
    export type CompositeType = OrCompositeType | AndCompositeType;
    export interface TemplateType extends AlphaType {
        $arch: "type";
        type: "template";
        parameter: Type;
        return: Type;
    }
    export const isTemplateTypeData: (template: any) => template is TemplateType;
    export interface MetaeType extends AlphaType {
        $arch: "type";
        type: "meta";
        parameter: Type;
        return: Type;
    }
    export const isMetaeTypeData: (template: any) => template is MetaeType;
    export type Type = TypeRefer | ValueType | ArrayType | TupleType | ObjectType | CompositeType | TemplateType | MetaeType;
    export type PrimitiveType = Type["type"];
    export const isTypeData: (template: any) => template is Type;
    export interface Call extends AlphaJsonarch {
        $arch: "call";
        refer: Refer;
        parameter?: Jsonable;
    }
    export const isCallData: (template: any) => template is Call;
    export interface Value extends AlphaJsonarch {
        $arch: "value";
        refer: Refer;
    }
    export const isValueData: (template: any) => template is Value;
    export module Library {
        module String {
            const json: (parameter: Jsonable | undefined) => string;
        }
    }
    export const isCompatibleType: (_source: Type, _destination: Type) => boolean;
    export const turnRefer: <Element_1 extends Function | JsonableValue>(root: Structure<Element_1>, refer: Refer) => Structure<Element_1> | undefined;
    export const resolveRefer: (entry: EvaluateEntry<AlphaJsonarch & {
        refer: Refer;
    }>) => Jsonable | undefined;
    export const evaluateCall: (entry: EvaluateEntry<Call>) => Promise<Jsonable>;
    export const evaluateValue: (entry: EvaluateEntry<Value>) => Promise<Jsonable>;
    export const evaluateIfMatch: <TargetType extends AlphaJsonarch>(isMatch: (entry: AlphaJsonarch) => entry is TargetType, evaluateTarget: (entry: EvaluateEntry<TargetType>) => Promise<Jsonable>) => (entry: EvaluateEntry<AlphaJsonarch>) => Promise<Jsonable | undefined>;
    export const evaluate: (entry: EvaluateEntry<AlphaJsonarch>) => Promise<Jsonable>;
    export const apply: (entry: EvaluateEntry<Jsonable>) => Promise<Jsonable>;
    export const applyRoot: (entry: CompileEntry, template: Jsonable, parameter: Jsonable, cache: Cache, setting: Setting) => Promise<Result>;
    export const process: (entry: CompileEntry) => Promise<Result>;
    export const multiplyString: (text: string, count: number) => string;
    export const smartJsonStringify: (json: Jsonable, indent?: "tab" | number, base?: number) => string;
    export const jsonToString: (json: Jsonable, asType: "result" | "output", setting: Setting) => string;
    export const throwIfError: <DataType extends Jsonable>(json: DataType) => DataType;
    export {};
}
