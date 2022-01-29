/* eslint-disable @typescript-eslint/no-non-null-assertion */
import amqp from "amqplib/callback_api"; //nos permitira reconectar
let amqp_conn: amqp.Connection, publisher_channel: amqp.Channel;
const offline_msg: any[] = []; //guarda los sms no enviados

//CONECTARSE A RABBITMQ--------------------------------------------------------
export const init_rabbitmq = () => {
  //establecemos conexion con el contenedor de rabbit
  amqp.connect("amqp://localhost", (err: Error, conn: amqp.Connection) => {
    //si existe un error intentaremos la reconecion con recursividad
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(init_rabbitmq, 1000);
    }
    //on establece listener cuando ocurren errores
    conn.on("error", (err) => {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] connection error:", err.message);
      }
    });
    //cuando se pierde la coneccion intenta conectar nuevamente
    conn.on("close", () => {
      console.error("[AMQP] reconnecting...");
      return setTimeout(init_rabbitmq, 1000);
    });

    console.log("[AMQP] connected");
    amqp_conn = conn;
    //Luego de establecer coneccion creamos el channel 
    create_publisher_channel();
  });
};
//-----------------------------------------------------------------------------
const close_for_err = (err: Error) => {
  if (!err) return false;
  console.error("[AMQP] error: ", err);
  amqp_conn.close();
  return true;
};
//ESTABLECER UN CANAL----------------------------------------------------------
const create_publisher_channel = async (): Promise<void> => {
  amqp_conn.createConfirmChannel((err, ch) => {
    if (close_for_err(err)) return;
    ch.on("error", (err) => {
      console.error("[AMQP] channel error:", err.message);
    });
    ch.on("close", () => {
      console.log("[AMQP] publisher channel closed");
    });
    publisher_channel = ch;
    //si tenemos mensajes en cola los enviamos
    if (offline_msg.length > 0) {
      offline_msg.forEach((msg) => {
        send_msg(msg.exchange, msg.routingKey, msg.content);
      });
      //y los eliminamos 
      offline_msg.pop();
    }
  });
};
//ENVIAR MSG-------------------------------------------------------------------
export const send_msg = async (
  exchange: string,
  routingKey: string,
  content: object | string
) => {
  try {
    const queue = "using_callbacks"; //nombre de la cola
    //compruaba existencia del exchange
    publisher_channel.assertExchange(exchange, "topic", { durable: true });
    //compruba existencia de la cola 
    publisher_channel.assertQueue(queue, { durable: true });
    //vincula la cola al exchange
    publisher_channel.bindQueue(queue, exchange, routingKey);

    console.log("sending a msg to exchange on rabbitmq");
    await publisher_channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(content)),
      { persistent: true }
    ); 
  } catch (err) {
    console.error("[AMQP] send error:", err);
    //si ocurrio un error y no se envia el msg, guardamos el mensaje en nuestra cola de msg no enviados 
    offline_msg.push({ exchange, routingKey, content });
  }
};
