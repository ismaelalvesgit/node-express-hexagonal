import { Socket } from "socket.io";

export default function realIp(socket: Socket, next: Function) {
    if(socket.handshake.headers["x-real-ip"]){
        socket.handshake.address = socket.handshake.headers["x-real-ip"][0];
    }
    next();
}