import { bot } from '..';

export const isInvFull = () => {
  return bot.inventory.emptySlotCount() === 0;
};

export const InvCleaner = async () => {
  const rotten_flesh_id = bot.registry.itemsByName.rotten_flesh!.id;
  const bone_id = bot.registry.itemsByName.bone!.id;
  const arrow_id = bot.registry.itemsByName.arrow!.id;
  const e = bot.entity;
  await bot.look(e.yaw + 90, e.pitch);
  const rotten_flesh = bot.inventory.findInventoryItem(
    rotten_flesh_id,
    null,
    false
  );
  const bone = bot.inventory.findInventoryItem(bone_id, null, false);
  const arrow = bot.inventory.findInventoryItem(arrow_id, null, false);
  if (rotten_flesh) await bot.toss(rotten_flesh.type, null, rotten_flesh.count);
  if (bone) await bot.toss(bone.type, null, bone.count);
  if (arrow) await bot.toss(arrow.type, null, arrow.count);
  await bot.look(e.yaw - 90, e.pitch);
};
