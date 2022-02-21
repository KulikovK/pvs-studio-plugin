import { Serializable, jsonProperty, jsonIgnore } from "ts-serializable";
import "reflect-metadata";

export class PVSNavigationInfo extends Serializable
{
    @jsonProperty(Number)
    public previousLine : Number = 0;

    @jsonProperty(Number)
    public currentLine : Number = 0;

    @jsonProperty(Number)
    public nextLine : Number = 0;

    @jsonProperty(Number)
    public columns : Number = 0;
}

export class PVSPositionsInfo extends Serializable
{
    @jsonProperty(String)
    public file : String = "";

    @jsonProperty(Number)
    public line : Number = 0;

    @jsonProperty(Number)
    public endLine : Number =0;

    @jsonProperty(Number)
    public column : Number = 0;

    @jsonProperty(Number)
    public endColumn : Number = 0;

    @jsonProperty(PVSNavigationInfo)
    public navigation : PVSNavigationInfo = new PVSNavigationInfo();
}

export class PVSWarningsInfo extends Serializable
{
    @jsonProperty(String)
    public code : String = "";

    @jsonProperty(Number)
    public cwe : Number = 0;

    @jsonProperty(String)
    public sastId : String = "";

    @jsonProperty(Number)
    public level : number = 0;

    @jsonProperty([PVSPositionsInfo])
    public positions : Array<PVSPositionsInfo> = [];

    @jsonProperty([String])
    public projects : Array<String> = [];
    
    @jsonProperty(String)
    public message : String = "";

    @jsonProperty(Boolean)
    public favorite : Boolean = false;

    @jsonProperty(Boolean)
    public falseAlarm : Boolean= false;
}

export class PVSReport extends Serializable
{
    @jsonProperty(Number)
    public version : Number = 2;

    @jsonProperty([PVSWarningsInfo])
    public warnings: Array<PVSWarningsInfo> = [];
}