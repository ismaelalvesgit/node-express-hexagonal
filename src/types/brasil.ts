export interface CepLocation {
  type: string,
  coordinates: {
    longitude: number,
    latitude: number
  }
}

export interface Cep {
  cep: number,
  state: string,
  city: string,
  neighborhood: string,
  street: string,
  service: string,
  location: CepLocation 
}

export interface IBrasilRepository {
  getCep(cep: number): Promise<Cep>;
}

export interface IBrasilService {
  getCep(cep: number): Promise<Cep>;
}

export interface IBrasilUseCase {
  getCep(cep: number): Promise<Cep>;
}
