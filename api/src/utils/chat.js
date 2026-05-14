function normalizeParticipantIds(firstId, secondId) {
  return [Number(firstId), Number(secondId)].sort((a, b) => a - b);
}

module.exports = {
  normalizeParticipantIds,
};
