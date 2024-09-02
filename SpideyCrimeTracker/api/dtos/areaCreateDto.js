export class AreaCreateDto {
    province;
    suburb;

    constructor(province, suburb) {
        this.province = province;
        this.suburb = suburb;
    }
}
