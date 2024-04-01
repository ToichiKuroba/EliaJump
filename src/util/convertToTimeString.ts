export function convertToTimeString(time: number) {
    let date = new Date(time);
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours = date.getUTCHours() + days * 24;
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    let milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

    return hours.toString().padStart(2, '0') + ':' + minutes + ':' + seconds + ':' + milliseconds
}