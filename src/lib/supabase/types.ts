export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			businesses: {
				Row: {
					id: string;
					name: string;
					slug: string;
					description: string | null;
					address: string;
					city: string;
					state: string;
					zip_code: string | null;
					phone: string | null;
					email: string | null;
					website: string | null;
					latitude: number | null;
					longitude: number | null;
					rating: number | null;
					review_count: number | null;
					verified: boolean | null;
					featured: boolean | null;
					business_type: string | null;
					price_range: string | null;
					hours: Json | null;
					amenities: string[] | null;
					photos: string[] | null;
					created_at: string;
					updated_at: string;
					owner_id: string | null;
				};
				Insert: {
					id?: string;
					name: string;
					slug: string;
					description?: string | null;
					address: string;
					city: string;
					state: string;
					zip_code?: string | null;
					phone?: string | null;
					email?: string | null;
					website?: string | null;
					latitude?: number | null;
					longitude?: number | null;
					rating?: number | null;
					review_count?: number | null;
					verified?: boolean | null;
					featured?: boolean | null;
					business_type?: string | null;
					price_range?: string | null;
					hours?: Json | null;
					amenities?: string[] | null;
					photos?: string[] | null;
					created_at?: string;
					updated_at?: string;
					owner_id?: string | null;
				};
				Update: {
					id?: string;
					name?: string;
					slug?: string;
					description?: string | null;
					address?: string;
					city?: string;
					state?: string;
					zip_code?: string | null;
					phone?: string | null;
					email?: string | null;
					website?: string | null;
					latitude?: number | null;
					longitude?: number | null;
					rating?: number | null;
					review_count?: number | null;
					verified?: boolean | null;
					featured?: boolean | null;
					business_type?: string | null;
					price_range?: string | null;
					hours?: Json | null;
					amenities?: string[] | null;
					photos?: string[] | null;
					created_at?: string;
					updated_at?: string;
					owner_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "businesses_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			business_categories: {
				Row: {
					id: string;
					business_id: string;
					category_id: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					business_id: string;
					category_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					business_id?: string;
					category_id?: string;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "business_categories_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "business_categories_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			categories: {
				Row: {
					id: string;
					name: string;
					slug: string;
					description: string | null;
					parent_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					slug: string;
					description?: string | null;
					parent_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					slug?: string;
					description?: string | null;
					parent_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "categories_parent_id_fkey";
						columns: ["parent_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			reviews: {
				Row: {
					id: string;
					business_id: string;
					user_id: string;
					rating: number;
					title: string | null;
					text: string;
					helpful_count: number | null;
					photos: string[] | null;
					response: string | null;
					response_date: string | null;
					status: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					business_id: string;
					user_id: string;
					rating: number;
					title?: string | null;
					text: string;
					helpful_count?: number | null;
					photos?: string[] | null;
					response?: string | null;
					response_date?: string | null;
					status?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					business_id?: string;
					user_id?: string;
					rating?: number;
					title?: string | null;
					text?: string;
					helpful_count?: number | null;
					photos?: string[] | null;
					response?: string | null;
					response_date?: string | null;
					status?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "reviews_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "reviews_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			users: {
				Row: {
					id: string;
					email: string;
					name: string | null;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					name?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					name?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"]) | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"]) : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
		? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
		? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database }, TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
		? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database }, EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"] : never = never> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
		? Database["public"]["Enums"][PublicEnumNameOrOptions]
		: never;
