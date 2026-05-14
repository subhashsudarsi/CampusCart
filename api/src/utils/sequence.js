const { Sequence } = require('../models');

async function getNextSequence(sequenceKey) {
  const sequence = await Sequence.findOneAndUpdate(
    { key: sequenceKey },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return sequence.value;
}

module.exports = {
  getNextSequence,
};
