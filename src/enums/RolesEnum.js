const rolesEnum = {
    PILOTO:        1,
    SOLICITANTE:   2,
    ADMINISTRADOR: 3,
    DIRECTOR:      4,
}

const getRoleText = roleId => {
    switch(roleId) {
        case rolesEnum.PILOTO: return 'Piloto';
        case rolesEnum.SOLICITANTE: return 'Solicitante';
        case rolesEnum.ADMINISTRADOR: return 'Administrador';
        case rolesEnum.DIRECTOR: return 'Director';
    }
}

export { rolesEnum, getRoleText }