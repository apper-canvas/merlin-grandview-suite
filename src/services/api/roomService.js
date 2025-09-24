class RoomService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const response = await this.apperClient.fetchRecords('room_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nightly_rate_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "checkin_time_c"}},
          {"field": {"Name": "checkout_time_c"}},
          {"field": {"Name": "blocked_c"}},
          {"field": {"Name": "block_reason_c"}},
          {"field": {"Name": "last_updated_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_history_c"}}
        ],
        orderBy: [{"fieldName": "room_number_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.map(room => ({
        Id: room.Id,
        roomNumber: room.room_number_c,
        floor: room.floor_c,
        roomType: room.room_type_c,
        status: room.status_c,
        nightlyRate: room.nightly_rate_c,
        guestName: room.guest_name_c,
        checkinTime: room.checkin_time_c,
        checkoutTime: room.checkout_time_c,
        blocked: room.blocked_c,
        blockReason: room.block_reason_c,
        lastUpdated: room.last_updated_c,
        notes: room.notes_c ? JSON.parse(room.notes_c) : [],
        statusHistory: room.status_history_c ? JSON.parse(room.status_history_c) : []
      })) || [];
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await this.apperClient.getRecordById('room_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nightly_rate_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "checkin_time_c"}},
          {"field": {"Name": "checkout_time_c"}},
          {"field": {"Name": "blocked_c"}},
          {"field": {"Name": "block_reason_c"}},
          {"field": {"Name": "last_updated_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_history_c"}}
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const room = response.data;
      return {
        Id: room.Id,
        roomNumber: room.room_number_c,
        floor: room.floor_c,
        roomType: room.room_type_c,
        status: room.status_c,
        nightlyRate: room.nightly_rate_c,
        guestName: room.guest_name_c,
        checkinTime: room.checkin_time_c,
        checkoutTime: room.checkout_time_c,
        blocked: room.blocked_c,
        blockReason: room.block_reason_c,
        lastUpdated: room.last_updated_c,
        notes: room.notes_c ? JSON.parse(room.notes_c) : [],
        statusHistory: room.status_history_c ? JSON.parse(room.status_history_c) : []
      };
    } catch (error) {
      console.error(`Failed to fetch room ${id}:`, error);
      throw new Error(`Room with ID ${id} not found`);
    }
  }

  async updateStatus(id, newStatus) {
    try {
      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(id),
          status_c: newStatus,
          last_updated_c: new Date().toISOString(),
          guest_name_c: newStatus === 'Available' ? '' : undefined,
          checkin_time_c: newStatus === 'Available' ? null : undefined,
          checkout_time_c: newStatus === 'Available' ? null : undefined
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} rooms:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to update room status:', error);
      throw error;
    }
  }

  async assignGuest(roomId, guestData) {
    try {
      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(roomId),
          status_c: 'Occupied',
          guest_name_c: guestData.guestName,
          checkin_time_c: guestData.checkinTime || new Date().toISOString(),
          checkout_time_c: guestData.checkoutTime,
          last_updated_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to assign guest:', error);
      throw error;
    }
  }

  async checkoutGuest(roomId) {
    try {
      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(roomId),
          status_c: 'Cleaning',
          last_updated_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to checkout guest:', error);
      throw error;
    }
  }

  async blockRoom(roomId, reason) {
    try {
      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(roomId),
          status_c: 'Out of Order',
          blocked_c: true,
          block_reason_c: reason,
          last_updated_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to block room:', error);
      throw error;
    }
  }

  async unblockRoom(roomId) {
    try {
      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(roomId),
          status_c: 'Available',
          blocked_c: false,
          block_reason_c: '',
          last_updated_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to unblock room:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(roomIds, newStatus) {
    try {
      const records = roomIds.map(roomId => ({
        Id: parseInt(roomId),
        status_c: newStatus,
        last_updated_c: new Date().toISOString(),
        guest_name_c: newStatus === 'Available' ? '' : undefined,
        checkin_time_c: newStatus === 'Available' ? null : undefined,
        checkout_time_c: newStatus === 'Available' ? null : undefined
      }));

      const response = await this.apperClient.updateRecord('room_c', {
        records
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} rooms:`, failed);
        }
        
        return successful.map(r => r.data);
      }
    } catch (error) {
      console.error('Failed to bulk update rooms:', error);
      throw error;
    }
  }

  async bulkBlockRooms(roomIds, reason) {
    try {
      const records = roomIds.map(roomId => ({
        Id: parseInt(roomId),
        status_c: 'Out of Order',
        blocked_c: true,
        block_reason_c: reason,
        last_updated_c: new Date().toISOString()
      }));

      const response = await this.apperClient.updateRecord('room_c', {
        records
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to block ${failed.length} rooms:`, failed);
        }
        
        return successful.map(r => r.data);
      }
    } catch (error) {
      console.error('Failed to bulk block rooms:', error);
      throw error;
    }
  }

  async addNote(roomId, noteContent) {
    try {
      // Get current room to append note
      const currentRoom = await this.getById(roomId);
      const newNote = {
        id: Date.now(),
        content: noteContent,
        timestamp: new Date().toISOString(),
        addedBy: 'Current User',
        type: 'General'
      };
      
      const updatedNotes = [...(currentRoom.notes || []), newNote];

      const response = await this.apperClient.updateRecord('room_c', {
        records: [{
          Id: parseInt(roomId),
          notes_c: JSON.stringify(updatedNotes),
          last_updated_c: new Date().toISOString()
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  }
}

export const roomService = new RoomService();