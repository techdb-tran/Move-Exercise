// This util function takes in the number of seconds, then return the duration in format HH/MM/SS, to display video duration onscreen

export default function durationToHms(d) {
  d = Number(d);

  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  if (h > 0) {
    return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
  }
  return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}
