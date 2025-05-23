import { createStore } from '@flowmo/stores/tasks';
import { toast } from 'sonner';
import supabase from '@/utils/supabase/client';

export const store = createStore(supabase, toast.error);
