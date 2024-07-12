import { generatorPutSchema } from "@p1223/shared";
import { Router } from "express";
import { generatorStore } from "./generator-store";

export const router = Router();

router.put("/default", async (req, res) => {
  const { bias } = generatorPutSchema.parse(req.body);
  req.log.info("Setting generator bias", { bias });
  const grid = await generatorStore.setConfig("default", bias);
  res.send({ grid });
});

router.get("/default", async (req, res) => {
  req.log.info("Get default bias");
  const grid = await generatorStore.get("default");
  if (!grid) {
    return res.status(404).send({ error: "Not found" });
  }
  res.send(grid);
});
