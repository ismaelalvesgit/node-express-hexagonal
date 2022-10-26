import { Contact } from "@type/contact";
import { ISocketConsumer, SocketConsumerConfig } from "@type/interface";
import { InternalServer } from "@util/error";
import { Logger } from "@util/logger";

export class ContactSocketConsume implements ISocketConsumer {

    private contactUseCase: SocketConsumerConfig["coreContainer"]["contactUseCase"];
    private socket: SocketConsumerConfig["socket"];

    constructor({ coreContainer, socket }: SocketConsumerConfig) {
        this.contactUseCase = coreContainer.contactUseCase;
        this.socket = socket;
    }

    init() {
        this.socket.on("disconnect", () => {
            Logger.info("Disconnect Socket");
        });
        this.newClient();
    }

    newClient() {
        this.socket.on("/example", async (msg) => {
            const contact = {
                name: "ismael",
                phone: new Date().getTime().toString()
            } as Contact;

            try {
                await this.contactUseCase.create(contact);
                Logger.info({
                    msg: "Notify contact create with success",
                    obj: { contact },
                });
            } catch (err) {
                Logger.info({
                    msg: "Failed to Notify contact",
                    obj: { contact },
                });

                const defaultMessage = "Failed to notify contact create";

                throw new InternalServer(defaultMessage, [{
                    obj: contact,
                }]);
            }
            Logger.info(msg);
        });
    }
}