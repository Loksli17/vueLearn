export class IDGenerator {
    private static count: number = 0;

    public static getID(): number {
        return this.count++;
    }
}