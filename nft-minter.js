import { ethers, JsonRpcProvider } from "ethers";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config(".env")

export async function mint(to, uri) {
    const provider = new JsonRpcProvider(process.env.RPC)
    const singer = await provider.getSigner()
    const abi = JSON.parse(fs.readFileSync("abis/NFTM.JSON"))
    const contract = new ethers.Contract(process.env.CONTRACTADDRESS, abi, singer)
    const result = await contract.safeMint(to, uri)
    console.log(result)
}

//mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "https;//www.s.com")