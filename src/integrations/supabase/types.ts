export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_chat: {
        Row: {
          conversations: Json | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          conversations?: Json | null
          created_at?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          conversations?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          items?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_active?: boolean | null
          name: string
          order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          active_calls: Json | null
          auto_reply_sent: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          online_users: Json | null
          participants: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          active_calls?: Json | null
          auto_reply_sent?: Json | null
          created_at?: string | null
          id: string
          messages?: Json | null
          online_users?: Json | null
          participants?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          active_calls?: Json | null
          auto_reply_sent?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          online_users?: Json | null
          participants?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_chat: {
        Row: {
          conversations: Json | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          conversations?: Json | null
          created_at?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          conversations?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      code_promos: {
        Row: {
          code: string
          created_at: string | null
          id: string
          pourcentage: number
          product_id: string | null
          product_name: string | null
          quantite: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id: string
          pourcentage: number
          product_id?: string | null
          product_name?: string | null
          quantite?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          pourcentage?: number
          product_id?: string | null
          product_name?: string | null
          quantite?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "code_promos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          adresse: string | null
          date_creation: string | null
          email: string
          id: string
          message: string | null
          nom: string
          objet: string | null
          prenom: string
          read: boolean | null
          telephone: string | null
        }
        Insert: {
          adresse?: string | null
          date_creation?: string | null
          email: string
          id: string
          message?: string | null
          nom: string
          objet?: string | null
          prenom: string
          read?: boolean | null
          telephone?: string | null
        }
        Update: {
          adresse?: string | null
          date_creation?: string | null
          email?: string
          id?: string
          message?: string | null
          nom?: string
          objet?: string | null
          prenom?: string
          read?: boolean | null
          telephone?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_sales: {
        Row: {
          created_at: string | null
          description: string | null
          discount: number
          end_date: string | null
          id: string
          is_active: boolean | null
          product_ids: string[] | null
          start_date: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount: number
          end_date?: string | null
          id: string
          is_active?: boolean | null
          product_ids?: string[] | null
          start_date?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          product_ids?: string[] | null
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          code_promo_used: string | null
          created_at: string | null
          discount: number | null
          id: string
          items: Json
          original_amount: number | null
          payment_method: string | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          code_promo_used?: string | null
          created_at?: string | null
          discount?: number | null
          id: string
          items: Json
          original_amount?: number | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          code_promo_used?: string | null
          created_at?: string | null
          discount?: number | null
          id?: string
          items?: Json
          original_amount?: number | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      panier: {
        Row: {
          created_at: string | null
          id: string
          products: Json | null
          total: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          products?: Json | null
          total?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          products?: Json | null
          total?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          date_ajout: string | null
          description: string | null
          flash_sale_description: string | null
          flash_sale_discount: number | null
          flash_sale_end_date: string | null
          flash_sale_price: number | null
          flash_sale_start_date: string | null
          flash_sale_title: string | null
          id: string
          image: string | null
          images: string[] | null
          is_sold: boolean | null
          name: string
          original_flash_price: number | null
          original_price: number | null
          price: number
          promotion: number | null
          promotion_end: string | null
          stock: number | null
        }
        Insert: {
          category: string
          date_ajout?: string | null
          description?: string | null
          flash_sale_description?: string | null
          flash_sale_discount?: number | null
          flash_sale_end_date?: string | null
          flash_sale_price?: number | null
          flash_sale_start_date?: string | null
          flash_sale_title?: string | null
          id: string
          image?: string | null
          images?: string[] | null
          is_sold?: boolean | null
          name: string
          original_flash_price?: number | null
          original_price?: number | null
          price: number
          promotion?: number | null
          promotion_end?: string | null
          stock?: number | null
        }
        Update: {
          category?: string
          date_ajout?: string | null
          description?: string | null
          flash_sale_description?: string | null
          flash_sale_discount?: number | null
          flash_sale_end_date?: string | null
          flash_sale_price?: number | null
          flash_sale_start_date?: string | null
          flash_sale_title?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          is_sold?: boolean | null
          name?: string
          original_flash_price?: number | null
          original_price?: number | null
          price?: number
          promotion?: number | null
          promotion_end?: string | null
          stock?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          adresse: string | null
          code_postal: string | null
          date_creation: string | null
          email: string | null
          genre: string | null
          id: string
          nom: string | null
          pays: string | null
          prenom: string | null
          role: string | null
          telephone: string | null
          user_id: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          date_creation?: string | null
          email?: string | null
          genre?: string | null
          id: string
          nom?: string | null
          pays?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          date_creation?: string | null
          email?: string | null
          genre?: string | null
          id?: string
          nom?: string | null
          pays?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
          user_id?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      pub_layout: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          text: string
        }
        Insert: {
          created_at?: string | null
          icon: string
          id: string
          text: string
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          text?: string
        }
        Relationships: []
      }
      remboursements: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          processed_date: string | null
          reason: string | null
          request_date: string | null
          status: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id: string
          notes?: string | null
          order_id?: string | null
          processed_date?: string | null
          reason?: string | null
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          processed_date?: string | null
          reason?: string | null
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      reset_codes: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at: string
          id: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          used?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          delivery_rating: number | null
          id: string
          photos: string[] | null
          product_id: string | null
          product_rating: number | null
          updated_at: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          delivery_rating?: number | null
          id: string
          photos?: string[] | null
          product_id?: string | null
          product_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          delivery_rating?: number | null
          id?: string
          photos?: string[] | null
          product_id?: string | null
          product_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_notifications: {
        Row: {
          customer_name: string | null
          date: string | null
          id: string
          image: string | null
          location: string | null
          name: string | null
          order_id: string | null
          original_price: number | null
          price: number | null
          product_id: string | null
          quantity: number | null
          subtotal: number | null
          time: string | null
          time_ago: string | null
          timestamp: string | null
        }
        Insert: {
          customer_name?: string | null
          date?: string | null
          id: string
          image?: string | null
          location?: string | null
          name?: string | null
          order_id?: string | null
          original_price?: number | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          subtotal?: number | null
          time?: string | null
          time_ago?: string | null
          timestamp?: string | null
        }
        Update: {
          customer_name?: string | null
          date?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string | null
          order_id?: string | null
          original_price?: number | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          subtotal?: number | null
          time?: string | null
          time_ago?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          appearance: Json | null
          created_at: string | null
          ecommerce: Json | null
          general: Json | null
          id: string
          notifications: Json | null
          payment: Json | null
          security: Json | null
          seo: Json | null
          shipping: Json | null
          system: Json | null
          updated_at: string | null
        }
        Insert: {
          appearance?: Json | null
          created_at?: string | null
          ecommerce?: Json | null
          general?: Json | null
          id?: string
          notifications?: Json | null
          payment?: Json | null
          security?: Json | null
          seo?: Json | null
          shipping?: Json | null
          system?: Json | null
          updated_at?: string | null
        }
        Update: {
          appearance?: Json | null
          created_at?: string | null
          ecommerce?: Json | null
          general?: Json | null
          id?: string
          notifications?: Json | null
          payment?: Json | null
          security?: Json | null
          seo?: Json | null
          shipping?: Json | null
          system?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          adresse: string | null
          avatar_url: string | null
          code_postal: string | null
          created_at: string | null
          date_naissance: string | null
          email: string
          email_verified: boolean | null
          genre: string | null
          id: string
          last_login: string | null
          nom: string | null
          password_unique: string | null
          pays: string | null
          prenom: string | null
          role: string | null
          telephone: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          avatar_url?: string | null
          code_postal?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email: string
          email_verified?: boolean | null
          genre?: string | null
          id: string
          last_login?: string | null
          nom?: string | null
          password_unique?: string | null
          pays?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          avatar_url?: string | null
          code_postal?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string
          email_verified?: boolean | null
          genre?: string | null
          id?: string
          last_login?: string | null
          nom?: string | null
          password_unique?: string | null
          pays?: string | null
          prenom?: string | null
          role?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          current_viewing: number | null
          daily: Json | null
          id: string
          last_visit: string | null
          monthly: Json | null
          online_users: string[] | null
          weekly: Json | null
          yearly: Json | null
        }
        Insert: {
          current_viewing?: number | null
          daily?: Json | null
          id?: string
          last_visit?: string | null
          monthly?: Json | null
          online_users?: string[] | null
          weekly?: Json | null
          yearly?: Json | null
        }
        Update: {
          current_viewing?: number | null
          daily?: Json | null
          id?: string
          last_visit?: string | null
          monthly?: Json | null
          online_users?: string[] | null
          weekly?: Json | null
          yearly?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_reset_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_json_data_to_supabase: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
