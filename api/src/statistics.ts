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
    const [queued, denied] = await Promise.all([getStats("queued"), getStats("denied")]);

    // Constructing the response object
    const response = {
      success: true,
      message: "Stats retrieved successfully.",
      data: {
        queued,
        denied,
      },
    };

    return res.status(200).json(response); // Use res.json() to send the response
  } catch (reason) {
    console.log(`Error for ${ip}:`, reason);
    const errorResponse = {
      success: false,
      message: "An error occurred while retrieving stats.",
      errorDetails: reason,
    };
    return res.status(500).json(errorResponse); // Use res.json() for error response as well
  }
}
