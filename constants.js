// ==== NUMERIC CONSTANTS ====

// The half life of water consumed before it gets absorbed, in minutes
const HALFLIFE = 45.0;

// Default bladder capacity
// (This is known to be low for omo folks, but better to err low)
const DEFAULT_CAP = 500; // default bladder capacity

// After asking permission, user cannot ask again until bladder has increased
// by capacity/fullness_quantum.
const FULLNESS_QUANTUM = 5;

// ==== INTERFACE TEXT ====

// Human-language text to use in the interface in it=s "normal" mode
const NORMAL_TEXT = {
  'unit': "ml",
  'drink': "Drink",
  'done': "Done Peeing",
  'cantHold': "I can't hold it!",
  'totalAmount': "Total drink volume",
  'resetLog': "[reset capacity log]",
  'resetConfirm': "Clear all stored capacity data?",
  'toggleMode': "[stealth mode]",
  'permissionQuestion': "May I pee?",
  'permissionGranted': "You may pee.",
  'permissionDenied': "You may <b>not</b> pee.",
  'emergency': "Potty emergency",
  'in': "in",
  'timeUnit': "minute",
  'timeUnitPlural': "minutes",
  'now': "now"
};

// Alternate human-language text to use in the interface when in "stealth" mode
const STEALTH_TEXT = {
  'unit': "kJ",
  'drink': "Energize",
  'done': "Engage",
  'cantHold': "Emergency shutdown!",
  'totalAmount': "Total energy",
  'resetLog': "[reset databanks]",
  'resetConfirm': "Reformat all databanks?",
  'toggleMode': "[lower shields]",
  'permissionQuestion': "Warp?",
  'permissionGranted': "Warp ready.",
  'permissionDenied': "Warp is offline.",
  'emergency': "Core breach",
  'in': 'estimate:',
  'timeUnit': "cycle",
  'timeUnitPlural': "cycles",
  'now': "imminent"
};
