var SDOrigin = {
    POINTER: -1,
    LEFT: 1 << 0,
    TOP: 1 << 1,
    RIGHT: 1 << 2,
    BOTTOM: 1 << 3,
    CENTER: 1 << 4
};

SDOrigin['TOPLEFT'] = SDOrigin.TOP | SDOrigin.LEFT;
SDOrigin['TOPRIGHT'] = SDOrigin.TOP | SDOrigin.RIGHT;
SDOrigin['BOTTOMLEFT'] = SDOrigin.BOTTOM | SDOrigin.LEFT;
SDOrigin['BOTTOMRIGHT'] = SDOrigin.BOTTOM | SDOrigin.RIGHT;
