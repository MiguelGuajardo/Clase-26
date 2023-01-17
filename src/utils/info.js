const argumentoDeEntrada = process.argv
const sistemaOperativo = process.platform
const versionNodeJs = process.version
const memoriaReservada = process.memoryUsage().rss
const pathEjecucion = process.title
const processID = process.pid
const carpertaDelProyecto = process.cwd()

module.exports =  INFO = {
    argumentoDeEntrada,sistemaOperativo,versionNodeJs,memoriaReservada,pathEjecucion,processID,carpertaDelProyecto
}