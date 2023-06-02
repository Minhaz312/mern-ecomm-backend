import os from "os"
const ip = Object.values(os.networkInterfaces())
.flat()
.filter((item) => !item.internal && item.family === "IPv4")
.map((item) => item.address)
.pop();

export default ip;