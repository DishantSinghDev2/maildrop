import client from "./redis";
import ratelimit from "./ratelimit";


export function getStats(key: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    client.get(`stats:${key}`).then((results: string | null) => {
      if (results === null) {
        resolve(0);
      } else {
        resolve(parseInt(results));
      }
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export async function statsHandler(req: any, res: any): Promise<any> {
  const ip = req.ip; // Get the client's IP address
  try {
    await ratelimit(ip); // Rate limiting
    console.log(`Client ${ip} requesting stats`);

    // Fetching queued and denied stats
    const [queued, denied] = await Promise.all([
      getStats("queued"),
      getStats("denied"),
    ]);

    // Sending the JSON response
    return res.status(200).json({
      success: true,
      message: "Stats retrieved successfully.",
      data: {
        queued,
        denied,
      },
    }).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    });
  } catch (reason) {
    console.log(`Error for ${ip}:`, reason);
    
    // Sending error response
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving stats.",
      errorDetails: reason,
    }).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    });
  }
}
