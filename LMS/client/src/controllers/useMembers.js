/**
 * useMembers — Custom hook acting as the Member Controller.
 * Manages all Member-related state and operations.
 * Keeps business logic out of the View components.
 */
import { useState, useEffect, useCallback } from "react";
import { memberService } from "../services/api";
import MemberModel from "../models/Member";

const useMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all members from the API
    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await memberService.getAll();
            setMembers(data);
        } catch (err) {
            setError("Failed to load members. Is the server running?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Create a new member
    const createMember = async (formData) => {
        const newMember = await memberService.create(formData);
        setMembers((prev) => [...prev, newMember]);
        return newMember;
    };

    // Update an existing member
    const updateMember = async (id, formData) => {
        const updated = await memberService.update(id, formData);
        setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
        return updated;
    };

    // Delete a member
    const deleteMember = async (id) => {
        await memberService.delete(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    return {
        members,
        loading,
        error,
        defaultValues: MemberModel.defaultValues,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,
    };
};

export default useMembers;
