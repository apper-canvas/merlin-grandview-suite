import { toast } from 'react-toastify';

class HousekeepingService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Task Management
  async getAllTasks() {
    try {
      const response = await this.apperClient.fetchRecords('housekeeping_task_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "task_type_c"}},
          {"field": {"Name": "special_instructions_c"}},
          {"field": {"Name": "supplies_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "created_by_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "assigned_to_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.map(task => ({
        Id: task.Id,
        roomNumber: task.room_number_c,
        roomId: task.room_id_c?.Id || task.room_id_c,
        status: task.status_c,
        assignedTo: task.assigned_to_c?.Id || task.assigned_to_c,
        assignedStaff: task.assigned_staff_c,
        priority: task.priority_c,
        estimatedTime: task.estimated_time_c,
        actualTime: task.actual_time_c,
        startTime: task.start_time_c,
        completedTime: task.completed_time_c,
        taskType: task.task_type_c,
        specialInstructions: task.special_instructions_c,
        supplies: task.supplies_c ? task.supplies_c.split(',') : [],
        createdAt: task.created_at_c,
        createdBy: task.created_by_c
      })) || [];
    } catch (error) {
      console.error('Failed to fetch housekeeping tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

  async getTasksByStatus(status) {
    try {
      const response = await this.apperClient.fetchRecords('housekeeping_task_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "task_type_c"}},
          {"field": {"Name": "special_instructions_c"}},
          {"field": {"Name": "supplies_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "assigned_to_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.map(task => ({
        Id: task.Id,
        roomNumber: task.room_number_c,
        roomId: task.room_id_c?.Id || task.room_id_c,
        status: task.status_c,
        assignedTo: task.assigned_to_c?.Id || task.assigned_to_c,
        assignedStaff: task.assigned_staff_c,
        priority: task.priority_c,
        estimatedTime: task.estimated_time_c,
        actualTime: task.actual_time_c,
        startTime: task.start_time_c,
        completedTime: task.completed_time_c,
        taskType: task.task_type_c,
        specialInstructions: task.special_instructions_c,
        supplies: task.supplies_c ? task.supplies_c.split(',') : [],
        createdAt: task.created_at_c,
        createdBy: task.created_by_c
      })) || [];
    } catch (error) {
      console.error('Failed to fetch tasks by status:', error);
      return [];
    }
  }

  async getTaskById(id) {
    try {
      const response = await this.apperClient.getRecordById('housekeeping_task_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "completed_time_c"}},
          {"field": {"Name": "task_type_c"}},
          {"field": {"Name": "special_instructions_c"}},
          {"field": {"Name": "supplies_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "assigned_to_c"}}
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const task = response.data;
      return {
        Id: task.Id,
        roomNumber: task.room_number_c,
        roomId: task.room_id_c?.Id || task.room_id_c,
        status: task.status_c,
        assignedTo: task.assigned_to_c?.Id || task.assigned_to_c,
        assignedStaff: task.assigned_staff_c,
        priority: task.priority_c,
        estimatedTime: task.estimated_time_c,
        actualTime: task.actual_time_c,
        startTime: task.start_time_c,
        completedTime: task.completed_time_c,
        taskType: task.task_type_c,
        specialInstructions: task.special_instructions_c,
        supplies: task.supplies_c ? task.supplies_c.split(',') : [],
        createdAt: task.created_at_c,
        createdBy: task.created_by_c
      };
    } catch (error) {
      console.error(`Failed to fetch task ${id}:`, error);
      throw new Error(`Task with ID ${id} not found`);
    }
  }

  async createTask(taskData) {
    try {
      const response = await this.apperClient.createRecord('housekeeping_task_c', {
        records: [{
          Name: taskData.Name || `Task for Room ${taskData.roomNumber}`,
          room_number_c: taskData.roomNumber,
          room_id_c: parseInt(taskData.roomId),
          status_c: 'pending',
          priority_c: taskData.priority || 'medium',
          estimated_time_c: taskData.estimatedTime || 30,
          task_type_c: taskData.taskType || 'standard_cleaning',
          special_instructions_c: taskData.specialInstructions || '',
          supplies_c: Array.isArray(taskData.supplies) ? taskData.supplies.join(',') : '',
          created_at_c: new Date().toISOString(),
          created_by_c: 'Current User'
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Task created successfully');
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  }

  async updateTaskStatus(id, newStatus, updates = {}) {
    try {
      const updateData = {
        Id: parseInt(id),
        status_c: newStatus,
        ...updates
      };

      // Handle status-specific updates
      if (newStatus === 'in_progress') {
        updateData.start_time_c = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_time_c = new Date().toISOString();
      }

      const response = await this.apperClient.updateRecord('housekeeping_task_c', {
        records: [updateData]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Task ${newStatus.replace('_', ' ')}`);
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
      throw error;
    }
  }

  async assignTask(taskId, staffId) {
    try {
      // First get staff name
      const staffResponse = await this.apperClient.getRecordById('staff_c', staffId, {
        fields: [{"field": {"Name": "name_c"}}]
      });

      let staffName = 'Unknown';
      if (staffResponse.success && staffResponse.data) {
        staffName = staffResponse.data.name_c;
      }

      const response = await this.apperClient.updateRecord('housekeeping_task_c', {
        records: [{
          Id: parseInt(taskId),
          assigned_to_c: parseInt(staffId),
          assigned_staff_c: staffName
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to assign ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Task assigned to ${staffName}`);
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to assign task:', error);
      toast.error('Failed to assign task');
      throw error;
    }
  }

  async getAllStaff() {
    try {
      const response = await this.apperClient.fetchRecords('staff_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "active_assignments_c"}},
          {"field": {"Name": "completed_today_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "specialties_c"}},
          {"field": {"Name": "department_c"}}
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.map(staff => ({
        Id: staff.Id,
        name: staff.name_c,
        role: staff.role_c,
        shift: staff.shift_c,
        status: staff.status_c,
        activeAssignments: staff.active_assignments_c || 0,
        completedToday: staff.completed_today_c || 0,
        rating: staff.rating_c,
        specialties: staff.specialties_c ? staff.specialties_c.split(',') : [],
        department: staff.department_c
      })) || [];
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      return [];
    }
  }

  async getHousekeepingStats() {
    try {
      const tasksResponse = await this.getAllTasks();
      const staffResponse = await this.getAllStaff();
      
      const totalTasks = tasksResponse.length;
      const pendingTasks = tasksResponse.filter(t => t.status === 'pending').length;
      const inProgressTasks = tasksResponse.filter(t => t.status === 'in_progress').length;
      const completedToday = tasksResponse.filter(t => 
        t.status === 'completed' && 
        t.completedTime &&
        new Date(t.completedTime).toDateString() === new Date().toDateString()
      ).length;
      
      const completedWithTime = tasksResponse.filter(t => t.actualTime && t.actualTime > 0);
      const averageTime = completedWithTime.length > 0 
        ? Math.round(completedWithTime.reduce((sum, t) => sum + t.actualTime, 0) / completedWithTime.length)
        : 0;

      return {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedToday,
        averageTime,
        staffStats: staffResponse
      };
    } catch (error) {
      console.error('Failed to get housekeeping stats:', error);
      return {
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedToday: 0,
        averageTime: 0,
        staffStats: []
      };
    }
  }

  async deleteTask(id) {
    try {
      const response = await this.apperClient.deleteRecord('housekeeping_task_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  }
}

export const housekeepingService = new HousekeepingService();