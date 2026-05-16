import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 시스템 설정 불러오기
export function useSystemSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('system_settings')
        .select('*')
      
      if (data) {
        const map = {}
        data.forEach(row => { map[row.key] = row.value })
        setSettings(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  return { settings, loading }
}

// 보유 데이터 불러오기
export function usePeople(filters = {}) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let query = supabase.from('people').select('*')
      
      if (filters.term_month) query = query.eq('term_month', filters.term_month)
      if (filters.term_type) query = query.eq('term_type', filters.term_type)
      if (filters.stage) query = query.eq('stage', filters.stage)
      if (filters.region) query = query.eq('region', filters.region)
      if (filters.status) query = query.eq('status', filters.status)

      const { data } = await query.order('created_at', { ascending: false })
      if (data) setPeople(data)
      setLoading(false)
    }
    load()
  }, [JSON.stringify(filters)])

  return { people, loading, setPeople }
}

// 오늘 만남 예정 불러오기
export function useTodayMeetings() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      const { data } = await supabase
        .from('meet_reports')
        .select('*, people(name, current_teacher, inducer, current_servant, stage)')
        .in('report_date', [today, yesterday])
        .eq('report_type', '만남결과')
        .order('report_time', { ascending: true })

      if (data) setMeetings(data)
      setLoading(false)
    }
    load()
  }, [])

  return { meetings, loading }
}