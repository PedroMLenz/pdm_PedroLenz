export class Usuario {
  constructor(
    public uid: string,
    public email: string,
    public nome: string,
    public urlFoto: string,
    public senha?: string
  ) {
    this.uid = uid;
    this.email = email;
    this.nome = nome;
    this.urlFoto = urlFoto;
    this.senha = senha;
  }
}
