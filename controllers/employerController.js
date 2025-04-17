const User = require('../models/User');
const Lead = require('../models/Lead');

//     Obtenir les statistiques du tableau de bord
// @route   GET /api/employer/dashboard-stats

exports.getDashboardStats = async (req, res) => {
  try {
    const inProgressCount = await Lead.countDocuments({ status: { $nin: ['COMPLETED', 'CANCELED'] } });
    const completedCount = await Lead.countDocuments({ status: 'COMPLETED' });
    const canceledCount = await Lead.countDocuments({ status: 'CANCELED' });

    res.json({
      inProgressCount,
      completedCount,
      canceledCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//    Obtenir tous les managers
// @route   GET /api/employer/managers

exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password');
    res.json(managers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Créer un manager
// @route   POST /api/employer/managers

exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const manager = await User.create({
      name,
      email,
      password,
      role: 'manager'
    });

    res.status(201).json({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//     Mettre à jour un manager
// @route   PUT /api/employer/managers/:managerId

exports.updateManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.managerId);

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    if (manager.role !== 'manager') {
      return res.status(400).json({ message: 'User is not a manager' });
    }

    const { name, email, password } = req.body;

    manager.name = name || manager.name;
    manager.email = email || manager.email;
    
    if (password) {
      manager.password = password;
    }

    const updatedManager = await manager.save();

    res.json({
      _id: updatedManager._id,
      name: updatedManager.name,
      email: updatedManager.email,
      role: updatedManager.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//   supp un manager
// @route   DELETE /api/employer/managers/:managerId

exports.deleteManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.managerId);

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    if (manager.role !== 'manager') {
      return res.status(400).json({ message: 'User is not a manager' });
    }

    await manager.remove();

    res.json({ message: 'Manager removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//    Obtenir tous les leads
// @route   GET /api/employer/leads
exports.getLeads = async (req, res) => {
  try {
    const { managerId, status } = req.query;
    
    let query = {};
    
    if (managerId) {
      query.managerId = managerId;
    }
    
    if (status) {
      query.status = status;
    }
    
    console.log('Fetching leads with query:', query);
    
    // Assurez-vous que la population fonctionne
    const leads = await Lead.find(query).populate('managerId', 'name email');
    console.log(`Found ${leads.length} leads`);
    
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
//     Créer un lead
// @route   POST /api/employer/leads

exports.createLead = async (req, res) => {
  try {
    const { contactName, contactEmail, companyName, status, managerId } = req.body;


    const manager = await User.findById(managerId);
    
    if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: 'Invalid manager ID' });
    }

    const lead = await Lead.create({
      contactName,
      contactEmail,
      companyName,
      status: status || 'PENDING',
      managerId,
      notes: []
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//    Mettre à jour un lead
// @route   PUT /api/employer/leads/:leadId

exports.updateLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const updateData = req.body;
    
    console.log(`Received update request for lead ${leadId}:`, updateData);
    
 
    const existingLead = await Lead.findById(leadId);
    if (!existingLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
  
    if (updateData.managerId) {
      console.log(`Verifying manager ID: ${updateData.managerId}`);
      const manager = await User.findById(updateData.managerId);
      if (!manager || manager.role !== 'manager') {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }
    
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      updateData,
      { new: true, runValidators: true }
    ).populate('managerId', 'name email');
    
    console.log('Updated lead:', updatedLead);
    res.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
//    supp un lead
// @route   DELETE /api/employer/leads/:leadId

exports.deleteLead = async (req, res) => {
  try {
    const leadId = req.params.leadId;
    
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    
    await Lead.deleteOne({ _id: leadId });

    res.json({ message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};