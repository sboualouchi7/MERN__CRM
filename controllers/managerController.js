const Lead = require('../models/Lead');

//    Obtenir les leads assignés au manager
// @route   GET /api/managers/leads

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ managerId: req.user._id });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//    Mettre à jour le statut ou les notes d'un lead
// @route   PATCH /api/managers/leads/:id

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Vérifier que le lead est bien assigné à ce manager
    if (lead.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    const { status, notes } = req.body;

    if (status) {
      lead.status = status;
    }

    if (notes) {
      lead.notes = notes;
    }

    const updatedLead = await lead.save();

    res.json(updatedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};