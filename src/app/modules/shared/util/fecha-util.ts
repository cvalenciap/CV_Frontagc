import AgcUtil from './agc-util';

export default class FechaUtil {

    public static DateToStringDDMMYYYY(date: Date): string {
        const dd = AgcUtil.padStart(String(date.getDate()), 2, '0');
        const mm = AgcUtil.padStart(String(date.getMonth() + 1), 2, '0');
        const yyyy = date.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
    }

    public static StringDDMMYYYYToDate(dateString: string): Date {
        if (dateString) {
            const dateSplit = dateString.trim().split('/');
        const date = new Date(parseInt(dateSplit[2], 10),
            parseInt(dateSplit[1], 10) - 1,
            parseInt(dateSplit[0], 10));
        return date;
        } else {
            return null;
        }
    }

}
