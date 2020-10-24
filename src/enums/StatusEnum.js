const statusEnum = {
    SOLICITED:        0,
    APROVED:          1,
    ASIGNED:          2,        
    IN_PROGRESS:      3,
    FINISHED:         4,
    CANCELLED:        -1
}

const getStatusText = statusId => {
    switch(statusId) {
        case statusEnum.SOLICITED: return 'Solicitado';
        case statusEnum.APROVED: return 'Autorizado';
        case statusEnum.ASIGNED: return 'Asignado';
        case statusEnum.IN_PROGRESS: return 'En Progreso';
        case statusEnum.FINISHED: return 'Completado';
        case statusEnum.CANCELLED: return 'Cancelado';
    }
}

export { statusEnum, getStatusText }