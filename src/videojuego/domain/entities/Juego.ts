export class Juego {
    constructor(
        readonly id: number | null, 
        readonly nombre: string,
        readonly compania: string,
        readonly descripcion: string,
        readonly cantidad: number,
        readonly logo: string
    ) {}
}