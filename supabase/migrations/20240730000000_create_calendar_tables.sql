-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL DEFAULT 'task', -- 'task', 'meeting', 'milestone', 'reminder'
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    all_day BOOLEAN DEFAULT false,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_attendees table for tracking who is assigned to/attending events
CREATE TABLE IF NOT EXISTS public.event_attendees (
    event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'attendee', -- 'organizer', 'attendee', 'optional'
    response TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'tentative'
    PRIMARY KEY (event_id, user_id)
);

-- Add RLS policies
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Calendar events policies
CREATE POLICY "Users can view events they created or are attending" 
    ON public.calendar_events FOR SELECT 
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.event_attendees WHERE event_id = id
        ) OR 
        auth.uid() = created_by
    );

CREATE POLICY "Users can insert events" 
    ON public.calendar_events FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update events they created" 
    ON public.calendar_events FOR UPDATE 
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete events they created" 
    ON public.calendar_events FOR DELETE 
    USING (auth.uid() = created_by);

-- Event attendees policies
CREATE POLICY "Users can view event attendees for their events" 
    ON public.event_attendees FOR SELECT 
    USING (
        event_id IN (
            SELECT id FROM public.calendar_events 
            WHERE created_by = auth.uid()
        ) OR 
        user_id = auth.uid()
    );

CREATE POLICY "Event creators can insert attendees" 
    ON public.event_attendees FOR INSERT 
    WITH CHECK (
        event_id IN (
            SELECT id FROM public.calendar_events 
            WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Event creators can update attendees" 
    ON public.event_attendees FOR UPDATE 
    USING (
        event_id IN (
            SELECT id FROM public.calendar_events 
            WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Event creators can delete attendees" 
    ON public.event_attendees FOR DELETE 
    USING (
        event_id IN (
            SELECT id FROM public.calendar_events 
            WHERE created_by = auth.uid()
        )
    );