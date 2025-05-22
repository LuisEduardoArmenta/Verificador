export class SchedulesService {
  // ... existing properties ...

  // Métodos para Edificios
  getEdificios(): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(`${this.apiUrl}/edificios/`);
  }

  createEdificio(edificio: Edificio): Observable<Edificio> {
    return this.http.post<Edificio>(`${this.apiUrl}/edificios/`, edificio);
  }

  updateEdificio(id: number, edificio: Edificio): Observable<Edificio> {
    return this.http.put<Edificio>(`${this.apiUrl}/edificios/${id}/`, edificio);
  }

  deleteEdificio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/edificios/${id}/`);
  }

  // Métodos para Aulas
  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas/`);
  }

  createAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(`${this.apiUrl}/aulas/`, aula);
  }

  updateAula(id: number, aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/aulas/${id}/`, aula);
  }

  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/aulas/${id}/`);
  }

  // Métodos para Carreras
  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras/`);
  }

  createCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(`${this.apiUrl}/carreras/`, carrera);
  }

  updateCarrera(id: number, carrera: Carrera): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/carreras/${id}/`, carrera);
  }

  deleteCarrera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carreras/${id}/`);
  }

  // Métodos para Grupos
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apiUrl}/grupos/`);
  }

  createGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.apiUrl}/grupos/`, grupo);
  }

  updateGrupo(id: number, grupo: Grupo): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/grupos/${id}/`, grupo);
  }

  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grupos/${id}/`);
  }

  // Métodos para Materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias/`);
  }

  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(`${this.apiUrl}/materias/`, materia);
  }

  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/`, materia);
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materias/${id}/`);
  }

  // ... existing code ...
} 