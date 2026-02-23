import type { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service.ts';
import Product from '../models/product.models.ts';
import Sales from '../models/sales.models.ts';
import Inventory from '../models/inventory.models.ts';
import Expense from '../models/expense.models.ts';
import Customer from '../models/customer.models.ts';

export class ChatbotController {
  async chat(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'Message is required' 
        });
      }

      const response = await geminiService.chat(message, conversationHistory);

      res.json({
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process chat message'
      });
    }
  }

  async getBusinessAdvice(req: Request, res: Response) {
    try {
      const { businessType } = req.body;

      if (!businessType) {
        return res.status(400).json({
          success: false,
          error: 'Business type is required'
        });
      }

      const advice = await geminiService.generateBusinessSetupAdvice(businessType);

      res.json({
        success: true,
        data: { advice }
      });
    } catch (error: any) {
      console.error('Business advice error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate business advice'
      });
    }
  }

  async analyticsChat(req: Request, res: Response) {
    try {
      console.log('Analytics chat request received');
      const { message, conversationHistory } = req.body;
      const user = (req as any).user;
      const shopId = user?.activeShopId;

      console.log('User:', user?.id);
      console.log('Shop ID:', shopId);
      console.log('Message:', message);

      if (!shopId) {
        console.error('No shop ID found. User:', user);
        return res.status(401).json({
          success: false,
          error: 'Shop authentication required. Please complete business registration.'
        });
      }

      if (!message || typeof message !== 'string') {
        console.error('Invalid message:', message);
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      console.log('Fetching shop data...');
      // Fetch shop data for context
      const [products, sales, inventory, expenses, customers] = await Promise.all([
        Product.find({ shopId }).limit(100).lean(),
        Sales.find({ shopId }).sort({ createdAt: -1 }).limit(100).lean(),
        Inventory.find({ shopId }).populate('productId').limit(100).lean(),
        Expense.find({ shopId }).sort({ date: -1 }).limit(50).lean(),
        Customer.find({ shopId }).limit(50).lean()
      ]);

      console.log('Data fetched:', {
        products: products.length,
        sales: sales.length,
        inventory: inventory.length,
        expenses: expenses.length,
        customers: customers.length
      });

      // Calculate key metrics
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      const totalProfit = totalRevenue - totalExpenses;
      const lowStockProducts = inventory.filter((inv: any) => inv.stock <= (inv.minStock || 5));
      
      const shopContext = {
        products: {
          total: products.length,
          categories: [...new Set(products.map(p => p.category))],
          sample: products.slice(0, 10).map(p => ({
            name: p.name,
            price: p.price,
            category: p.category
          }))
        },
        sales: {
          total: sales.length,
          totalRevenue: totalRevenue.toFixed(2),
          recentSales: sales.slice(0, 5).map(s => ({
            date: s.createdAt,
            amount: s.totalAmount,
            items: s.items?.length || 0
          }))
        },
        inventory: {
          total: inventory.length,
          lowStock: lowStockProducts.length,
          lowStockItems: lowStockProducts.slice(0, 5).map((inv: any) => ({
            name: inv.productId?.name,
            stock: inv.stock,
            minStock: inv.minStock
          }))
        },
        expenses: {
          total: expenses.length,
          totalAmount: totalExpenses.toFixed(2),
          recentExpenses: expenses.slice(0, 5).map(e => ({
            category: e.category,
            amount: e.amount,
            date: e.date
          }))
        },
        customers: {
          total: customers.length,
          sample: customers.slice(0, 5).map(c => ({
            name: c.name,
            contact: c.contact?.[0] || 'N/A'
          }))
        },
        metrics: {
          totalRevenue: totalRevenue.toFixed(2),
          totalExpenses: totalExpenses.toFixed(2),
          totalProfit: totalProfit.toFixed(2)
        }
      };

      console.log('Calling Gemini/Ollama service...');
      // Get AI response with shop context
      const response = await geminiService.analyzeBusinessData(
        message,
        shopContext,
        conversationHistory
      );

      console.log('AI response received, length:', response.length);

      res.json({
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString(),
          context: {
            dataPoints: {
              products: products.length,
              sales: sales.length,
              lowStockItems: lowStockProducts.length
            }
          }
        }
      });
    } catch (error: any) {
      console.error('Analytics chat error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process analytics query'
      });
    }
  }
}

export const chatbotController = new ChatbotController();