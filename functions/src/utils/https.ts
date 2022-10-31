import * as https from "node:https";
import {logger} from "firebase-functions/v2";

/**
 *
 * @param {string} url API endpoint
 * @param {object} body JSON payload
 * @return {Promise<object | string>} API response
 */
export function postRequest(url: string, body: object):
  Promise<object | string> {
  logger.debug("[postRequest]", {url, body});

  const strBody = JSON.stringify(body);

  return new Promise((resolve) => {
    const request = https.request(url, (res) => {
      logger.debug("[postRequest] Webhook response", res);
      const chunks: Uint8Array[] = [];
      res.on("data", (data) => chunks.push(data));
      res.on("end", () => {
        const responseData = Buffer.concat(chunks).toString("utf-8");
        logger.debug("[postRequest] Response data", responseData);
        if (res.headers["content-type"] === "application/json") {
          resolve(JSON.parse(responseData));
        } else {
          resolve(responseData);
        }
      });
    });
    request.method = "POST";
    request.setHeader("Content-Length", Buffer.byteLength(strBody, "utf-8"));
    request.write(body);
    request.end();
  });
}


