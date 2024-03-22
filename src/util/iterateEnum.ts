export function iterateEnum(enumType: {}) {
    return Object.values(enumType).map(value => Number(value)).filter(value => Number.isInteger(value)).sort((a, b) => a - b);
}